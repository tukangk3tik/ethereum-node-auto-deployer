
import networks from "../data/network_list.json" assert { type: 'json' };
import nodeTypes from "../data/node_types.json" assert { type: 'json' };

export const getListNodeTypes = async (_req, reply) => {
  try {
    reply.code(200).send({ data: nodeTypes });
  } catch (error) {
    reply.code(500).send(error);
  }
};

export const getListNetwork = async (_req, reply) => {
  try {
    reply.code(200).send({ data: networks });
  } catch (error) {
    reply.code(500).send(error);
  }
};
    