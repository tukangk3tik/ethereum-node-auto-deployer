
import { createEthNode, getEthNode, stopEthNode, deleteEthNode } from "../handler/eth-node.handler.js";
import { createEthNodeSchema, stopEthNodeSchema, deleteEthNodeSchema } from "../schemas/eth-node.schema.js";

async function routes(fastify) {
  fastify.get("/eth-node", {
    preHandler: fastify.auth,
    handler: getEthNode,
  });

  fastify.post("/eth-node", {
    preHandler: fastify.auth,
    schema: createEthNodeSchema,
    handler: createEthNode,
  });

  fastify.patch("/eth-node/:id/stop", {
    preHandler: fastify.auth,
    schema: stopEthNodeSchema,
    handler: stopEthNode,
  });

  fastify.delete("/eth-node/:id", {
    preHandler: fastify.auth,
    schema: deleteEthNodeSchema,
    handler: deleteEthNode,
  });
}

export default routes;