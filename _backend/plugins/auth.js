import jwt from "jsonwebtoken";
import fp from 'fastify-plugin';

export default fp(async function(fastify, _opts) {
  fastify.decorate('auth', async function (req, reply) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ message: 'Missing or invalid token' });
      }

      const token = authHeader.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      req.user = decodedToken;
    } catch (error) {
      reply.code(401).send({
        message: 'You are not authenticated!'
      });
    }
  });
});