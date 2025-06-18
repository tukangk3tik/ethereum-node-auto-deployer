import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/users.js';
import bcrypt from 'bcrypt';

async function seedUser() {
  try {
    const hash = bcrypt.hashSync('password1234', Number(process.env.BCRYPT_SALT_ROUNDS ?? 10));

    const newUser = new User({
      username: 'felix',
      email: 'felix@tech.site',
      password: hash,
      role: 'admin',
    });
    await newUser.save();   
  } catch (error) {
    console.log(error.message);
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await seedUser();
  process.exit();
}

seed();