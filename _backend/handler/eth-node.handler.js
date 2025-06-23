import AnsibleRunner from "../events/ansible-runner.js";
import EthNode from "../models/eth-node.js";
import EthNodeLog from "../models/eth-node-logs.js";
import crypto from "crypto";
import EthNodeArchive from "../models/eth-node-archives.js";

// This using upsert, so for new insert or update will execute this api
export const createEthNode = async (_req, reply) => {
  try {
    const deployNumber = crypto.randomInt(100000, 999999);

    const { 
      node_code, 
      client_type, 
      network, 
      host_ip, 
      host_user, 
      private_key, 
      http_port, 
      ws_port, 
      p2p_port, 
    } = _req.body;

    const ethNode = await EthNode.findOneAndUpdate(
      { node_code },
      {
        $set: {
          client_type,
          network,
          host_ip,
          host_user,
          http_port,
          ws_port,
          p2p_port,
          deploy_number: `${deployNumber}`,
          status: "deploying",
          updated_at: new Date(),
        },
        $setOnInsert: {
          node_code,
          deploy_at: null,
          created_by: _req.user._id,
        },
      },
      { upsert: true, new: true }
    );
    
    const args = [
      '-i',
      `${host_ip},`,
      '--user',
      host_user,
      '--private-key',
      private_key,
      '--extra-vars',
      `GETH_DATA_DIR=/data/ethereum/${node_code} GETH_HTTP_PORT=${http_port} GETH_WS_PORT=${ws_port} GETH_P2P_PORT=${p2p_port} GETH_NETWORK=${network} GETH_CONTAINER_NAME=${node_code}`,
    ];

    let isDeployed = false;
    let isError = false;
    const runner = new AnsibleRunner();
    runner.on('stdout', (line) => {
      if (line.includes('[DEPLOY_SUCCESS]')) {
        isDeployed = true;
        EthNodeLog.create({
          node_id: ethNode._id,
          node_code,
          deploy_number: `${deployNumber}`,
          transaction_type: "deploy",
          status: "success",
          message: line.trim(),
        });
      }

      if (line.includes('FAILED!')) {
        isError = true;
        EthNodeLog.create({
          node_id: ethNode._id,
          node_code,
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
    });
    runner.on('error', () => {
      ethNode.status = "error";
      ethNode.save();
    });
    runner.run(`playbook-${client_type}.yml`, args, `${ethNode._id}-${deployNumber}.log`);

    reply.code(201).send({ 
      data: {
        _id: ethNode._id,
        node_code,
        client_type,
        network,
        host_ip,
        host_user,
        http_port,
        ws_port,
        p2p_port,
        status: "deploying",
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
    const { private_key } = _req.body;
    const ethNode = await EthNode.findOne({ _id: id });
    if (!ethNode) {
      return reply.code(404).send({
        message: 'Node not found',
      });
    }

    ethNode.status = "stopping";
    ethNode.save();

    const args = [
      '-i',
      `${ethNode.host_ip},`,
      '--user',
      ethNode.host_user,
      '--private-key',
      private_key,
      '--extra-vars',
      `GETH_CONTAINER_NAME=${ethNode.node_code}`,
    ];

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
    });
    runner.on('error', () => {
      ethNode.status = "error";
      ethNode.save();
    });
    runner.run(`playbook-${ethNode.client_type}-stop.yml`, args, `${ethNode._id}-${ethNode.deploy_number}-stop.log`);
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
    const ethNodeQuery = EthNode.find().select('-deploy_number -host_user -created_at -updated_at -deleted_at -__v');
    let fetchedEthNode;

    if (limit && currentPage) {
      ethNodeQuery
        .skip(limit * (currentPage - 1))
        .limit(limit);
    }
    fetchedEthNode = await ethNodeQuery;

    const metaData = {
      current_page: currentPage,
      per_page: limit,
      total_items: fetchedEthNode.length
    };

    reply.code(200).send({ data: fetchedEthNode, meta_data: metaData });
  } catch (error) {
    reply.code(500).send({
      message: error.message,
    });
  }
}
  