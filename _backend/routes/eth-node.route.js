
import { createEthNode, getEthNode } from "../handler/eth-node.handler.js";
import { createEthNodeSchema } from "../schemas/eth-node.schema.js";

async function routes(fastify) {
  fastify.get("/eth-node", {
    // preHandler: fastify.auth,
    handler: getEthNode,
  });

  fastify.post("/eth-node", {
    preHandler: fastify.auth,
    schema: createEthNodeSchema,
    handler: createEthNode,
  });
}

export default routes;