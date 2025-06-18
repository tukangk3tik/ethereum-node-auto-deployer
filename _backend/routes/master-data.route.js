import { getListNetwork, getListNodeTypes } from "../handler/master-data.handler.js";

async function routes(fastify) {
  fastify.get("/master-data/node-types", {
    handler: getListNodeTypes,
  });

  fastify.get("/master-data/networks", {
    preHandler: fastify.auth,
    handler: getListNetwork,
  });
}

export default routes;