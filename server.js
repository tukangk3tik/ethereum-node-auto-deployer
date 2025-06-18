import dotenv from 'dotenv';
import buildApp from './_backend/app.js';

dotenv.config();
const port = process.env.BACKEND_APP_PORT || 3000;

buildApp().then((app) => {
  app.listen({port: port}, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running on ${address}`);
  });
});
