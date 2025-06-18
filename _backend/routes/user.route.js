import { userLogin } from "../handler/user.handler.js";
import { createUser } from "../schemas/user.schema.js";

async function routes(fastify) {
  fastify.post("/auth", {
    schema: createUser,
    handler: userLogin,
  });
}

export default routes;