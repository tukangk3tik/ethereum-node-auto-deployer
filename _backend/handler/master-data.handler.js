import EthClientType from "../models/eth-client-type.js";
import EthNetworkList from "../models/eth-network-list.js";

export const getListNodeTypes = async (_req, reply) => {
  try {
    const nodeTypes = await EthClientType.find().select('-created_at -__v');
    reply.code(200).send({ data: nodeTypes });
  } catch (error) {
    reply.code(500).send(error);
  }
};

export const getListNetwork = async (_req, reply) => {
  try {
    const networks = await EthNetworkList.find().select('-created_at -__v');
    reply.code(200).send({ data: networks });
  } catch (error) {
    reply.code(500).send(error);
  }
};
    