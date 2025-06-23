import { getListNetwork, getListNodeTypes } from "../handler/master-data.handler.js";

async function routes(fastify) {
  fastify.get("/master/client-type", {
    handler: getListNodeTypes,
  });

  fastify.get("/master/network", {
    handler: getListNetwork,
  });
}

export default routes;