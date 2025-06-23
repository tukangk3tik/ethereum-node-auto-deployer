import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/users.js';
import bcrypt from 'bcrypt';

async function seedUser() {
  try {
    const hash = bcrypt.hashSync('password1234', Number(process.env.BCRYPT_SALT_ROUNDS ?? 10));

    User.findOneAndUpdate({ email: 'felix@tech.site' }, {
      $setOnInsert: {
        username: 'felix',
        email: 'felix@tech.site',
        name: 'Felix',
        password: hash,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
    }, { upsert: true, new: true });
  } catch (error) {
    console.log(error.message);
  }
}

export default seedUser;