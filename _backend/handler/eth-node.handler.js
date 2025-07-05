import AnsibleRunner from "../events/ansible-runner.js";
import EthNode from "../models/eth-node.js";
import EthNodeLog from "../models/eth-node-logs.js";
import crypto from "crypto";
import EthNodeArchive from "../models/eth-node-archives.js";
import moment from "moment/moment.js";
import fs from "fs";
import path from "path";
import util from "util";
import { pipeline } from "stream";
import { errorState } from "../vars/ansible_vars.js";
import { allowedSshKeyTypes, uploadSshKeyDir } from "../vars/file_vars.js";
import { nodeFormSchema } from "../schemas/eth-node.schema.js";
import ethNetworkList from "../models/eth-network-list.js";
import ethClientType from "../models/eth-client-type.js";
import mongoose from "mongoose";

// This using upsert, so for new insert or update will execute this api
export const createEthNode = async (_req, reply) => {
  try {
    const parts = _req.parts();
    const fields = {};

    let sshFile = null;
    let filename = '';
    let fileInfo = null;
    for await (const part of parts) {
      if (part.file && part.fieldname === 'private_key') {
        // Validate file type
        if (!allowedSshKeyTypes.includes(part.mimetype)) {
          return reply.code(400).send({
            success: false,
            error: 'Invalid SSH key file type. Must be plain text',
            code: 'INVALID_SSH_KEY_TYPE'
          });
        }

        sshFile = part.file;
        filename = `${Date.now()}-${part.filename}`;
        fileInfo = {
          filename,
          originalName: part.filename,
          mimetype: part.mimetype,
        };
      } else {
        fields[part.fieldname] = part.value;
      }
    }
    
    const { error, _ } = nodeFormSchema.validate(fields);
    if (error) {
      return reply.code(400).send({
        message: error.details[0].message,
      });
    }

    let privateKeyPath = null;
    if (fileInfo) {
      const pump = util.promisify(pipeline);
        
      const filepath = path.join(uploadSshKeyDir, filename);
      await pump(sshFile, fs.createWriteStream(filepath));
      const fileStats = fs.statSync(filepath);

      fs.chmodSync(filepath, 0o600);
      fileInfo.filename = filename;
      fileInfo.size = fileStats.size;
      privateKeyPath = filepath;
    }

    let deployNumber = '000000';
    let deployStatus = "stopped";
    if (fields.auto_deploy === 'true') {
      deployStatus =  "deploying";
      deployNumber = crypto.randomInt(100000, 999999);
    }

    const proj = { _id: 1, key: 1, name: 1 };
    const clientTypeDetail = await ethClientType.findOne({_id: fields.client_type}, proj);
    const networkDetail = await ethNetworkList.findOne({_id: fields.network}, proj);

    if (!clientTypeDetail) {
      return reply.code(400).send({
        message: 'Client type is not available for now',
      });
    }

    if (!networkDetail) {
      return reply.code(400).send({
        message: 'Network is not available for now',
      });
    }

    const ethNode = await EthNode.findOneAndUpdate(
      { node_code: fields.node_code },
      {
        $set: {
          client_type: clientTypeDetail,
          network: networkDetail,
          host_ip: fields.host_ip,
          host_user: fields.host_user,
          using_private_key: !!privateKeyPath,
          http_port: fields.http_port,
          ws_port: fields.ws_port,
          p2p_port: fields.p2p_port,
          deploy_number: `${deployNumber}`,
          status: deployStatus,
          deploy_at: null,
          updated_at: new Date(),
        },
        $setOnInsert: {
          node_code: fields.node_code,
          created_by: { 
            _id: _req.user._id,
            name: _req.user.name, 
          },
        },
      },
      { upsert: true, new: true }
    );

    if (fields.auto_deploy) {
      const privateKeyParams = [];
      if (privateKeyPath) {
        privateKeyParams.push('--private-key', privateKeyPath);
      }
      const args = [
        '-i',
        `${ethNode.host_ip},`,
        '--user',
        ethNode.host_user,
        ...privateKeyParams,
        '--extra-vars',
        `GETH_DATA_DIR=/data/ethereum/${ethNode.node_code} GETH_HTTP_PORT=${ethNode.http_port} GETH_WS_PORT=${ethNode.ws_port} GETH_P2P_PORT=${ethNode.p2p_port} GETH_NETWORK=${ethNode.network.key} GETH_CONTAINER_NAME=${ethNode.node_code}`,
      ];
      runDeploy(ethNode, args, deployNumber, privateKeyPath);
    }

    reply.code(201).send({
      data: {
        _id: ethNode._id,
        node_code: ethNode.node_code,
        client_type: ethNode.client_type,
        network: ethNode.network,
        host_ip: ethNode.host_ip,
        host_user: ethNode.host_user,
        http_port: ethNode.http_port,
        ws_port: ethNode.ws_port,
        p2p_port: ethNode.p2p_port,
        status: deployStatus,
        deploy_at: null,
        deploy_number: `${deployNumber}`,
        created_by: _req.user._id,
      } 
    });
  } catch (error) {
    reply.code(500).send({
      message: error.message,
    });
  }
}

export const stopEthNode = async (_req, reply) => {
  try {
    const { id } = _req.params;
    const ethNode = await EthNode.findOne({ _id: id });
    if (!ethNode) {
      return reply.code(404).send({
        message: 'Node not found',
      });
    }

    const parts = _req.parts();
    let sshFile = null;
    let filename = '';
    let fileInfo = null;
    for await (const part of parts) {
      console.log(part.fieldname);
      if (part.file && part.fieldname === 'private_key') {
        // Validate file type
        if (!allowedSshKeyTypes.includes(part.mimetype)) {
          return reply.code(400).send({
            success: false,
            error: 'Invalid SSH key file type. Must be plain text',
            code: 'INVALID_SSH_KEY_TYPE'
          });
        }

        sshFile = part.file;
        filename = `${Date.now()}-${part.filename}`;
        fileInfo = {
          filename,
          originalName: part.filename,
          mimetype: part.mimetype,
        };
      }
    }

    let privateKeyPath = null;
    if (fileInfo) {
      const pump = util.promisify(pipeline);
        
      const filepath = path.join(uploadSshKeyDir, filename);
      await pump(sshFile, fs.createWriteStream(filepath));
      const fileStats = fs.statSync(filepath);

      fs.chmodSync(filepath, 0o600);
      fileInfo.filename = filename;
      fileInfo.size = fileStats.size;
      privateKeyPath = filepath;
    }
    
    if (ethNode.using_private_key && !privateKeyPath) {
      return reply.code(400).send({
        message: 'Private key is required',
      });
    }

    ethNode.status = "stopping";
    ethNode.save();

    const privateKeyParams = [];
    if (privateKeyPath) {
      privateKeyParams.push('--private-key', privateKeyPath);
    }
    const args = [
      '-i',
      `${ethNode.host_ip},`,
      '--user',
      ethNode.host_user,
      ...privateKeyParams,
      '--extra-vars',
      `GETH_CONTAINER_NAME=${ethNode.node_code}`,
    ];
    await stopDeployedNode(ethNode, args, privateKeyPath);

    reply.code(200).send({ 
      data: {
        _id: ethNode._id,
        node_code: ethNode.node_code,
        deploy_number: `${ethNode.deploy_number}`,
      } 
    });
  } catch (error) {
    reply.code(500).send({
      message: error.message,
    });
  }
}

export const deleteEthNode = async (_req, reply) => {
  try {
    const { id } = _req.params;
    const ethNode = await EthNode.findOne({ _id: id });
    if (!ethNode) {
      return reply.code(404).send({
        message: 'Node not found',
      });
    }

    if (ethNode.status !== 'stopped') {
      return reply.code(400).send({
        message: 'Node must be stopped before deleting',
      });
    }

    await EthNode.deleteOne({ _id: id });
    await EthNodeArchive.create({
      node_id: id,
      node_code: ethNode.node_code,
      node_detail: ethNode,
      execute_by: {
        _id: _req.user._id,
        name: _req.user.name,
        email: _req.user.email,
      },
      status: "deleted",
    });
    reply.code(200).send({
      message: 'Node delete successfully!',
    });
  } catch (error) {
    reply.code(500).send({
      message: error.message,
    });
  }
}

export const getEthNode = async (_req, reply) => {
  try {
    const limit = +_req.query.limit; // (+) for convert to number
    const currentPage = +_req.query.page;
    const ethNodeQuery = EthNode.find({ deleted_at: null }).select('-deploy_number -created_at -updated_at -deleted_at -__v');
    let fetchedEthNode;

    const totalItems = await EthNode.countDocuments({ deleted_at: null });
    if (limit && currentPage) {
      ethNodeQuery
        .skip(limit * (currentPage - 1))
        .limit(limit);
    }

    fetchedEthNode = await ethNodeQuery;
    fetchedEthNode = fetchedEthNode.map((node) => {
      const newNode = {
        ...node.toObject(),
        uptime: node.deploy_at ? moment(node.deploy_at).fromNow() : "-",
      }
      return newNode;
    });

    const metaData = {
      current_page: currentPage,
      limit: limit,
      total_items: totalItems,
    };

    reply.code(200).send({ data: fetchedEthNode, meta_data: metaData });
  } catch (error) {
    reply.code(500).send({
      message: error.message,
    });
  }
}

// This function is used to run the ansible playbook for deploying the Ethereum node
// It will listen to the stdout and stderr events to check the deployment status
const runDeploy = async (ethNode, args, deployNumber, privateKey = null) => {
  let isDeployed = false;
  let isError = false;

  const runner = new AnsibleRunner();
  runner.on('stdout', (line) => {
    if (line.includes('[DEPLOY_SUCCESS]')) {
      isDeployed = true;
      EthNodeLog.create({
        node_id: ethNode._id,
        node_code: ethNode.node_code,
        deploy_number: `${deployNumber}`,
        transaction_type: "deploy",
        status: "success",
        message: line.trim(),
      });
    }

    if (errorState.some(state => line.includes(state))) {
      isError = true;
      EthNodeLog.create({
        node_id: ethNode._id,
        node_code: ethNode.node_code,
        deploy_number: `${deployNumber}`,
        transaction_type: "deploy",
        status: "error",
        message: line.trim(),
      });
    }
  });
  runner.on('stderr', () => {});
  runner.on('done', () => {
    if (isDeployed) {
      ethNode.status = "running";
      ethNode.deploy_at = new Date();
      ethNode.save();
    }
    if (isError) { 
      ethNode.status = "error";
      ethNode.save();
    }
    if (privateKey) {
      fs.unlinkSync(privateKey);
    }
  });
  runner.on('error', () => {
    ethNode.status = "error";
    ethNode.save();
  });
  runner.run(`playbook-${ethNode.client_type.key}.yml`, args, `${ethNode._id}-${deployNumber}.log`);
}

// This function is used to stop the deployed Ethereum node
// It will listen to the stdout and stderr events to check the stop status
const stopDeployedNode = async (ethNode, args, privateKey = null) => {
  let isStopped = false;
  const runner = new AnsibleRunner();
  runner.on('stdout', (line) => {
    if (line.includes('[STOP_SUCCESS]')) {
      isStopped = true;
      EthNodeLog.create({
        node_id: ethNode._id,
        node_code: ethNode.node_code,
        deploy_number: `${ethNode.deploy_number}`,
        transaction_type: "stop",
        status: "success",
        message: line.trim(),
      });
    }
  });
  runner.on('stderr', () => {});
  runner.on('done', () => {
    if (isStopped) {
      ethNode.status = "stopped";
      ethNode.save();
    }

    if (privateKey) {
      fs.unlinkSync(privateKey);
    }
  });
  runner.on('error', () => {
    ethNode.status = "error";
    ethNode.save();
  });
  runner.run(`playbook-${ethNode.client_type.key}-stop.yml`, args, `${ethNode._id}-${ethNode.deploy_number}-stop.log`);
}