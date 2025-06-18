import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/users.js";

export const userLogin = async (_req, reply) => {
  try {
    const { email, password } = _req.body;
    let fetchedUser;

    fetchedUser = await User.findOne({ email });
    if (!fetchedUser) {
      return reply.code(401).send({
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, fetchedUser.password);
    if (!isPasswordValid) {
      return reply.code(401).send({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign({ email: fetchedUser.email }, process.env.JWT_KEY, {
      expiresIn: process.env.JWT_EXPIRED,
    });

    reply.code(201).send({
      data: {
        token: token,
        expiresIn: process.env.JWT_EXPIRED,
        userId: fetchedUser._id,
      }
    });
  } catch (error) {
    reply.code(500).send({
      message: error.message,
    });
  }
}