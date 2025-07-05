import fs from 'fs'; import path from 'path';
import { uploadSshKeyDir } from './vars/file_vars.js';

async function setupProject() {
  try {
    if (!fs.existsSync(process.env.ANSIBLE_LOG_PATH)) {
      fs.mkdirSync(process.env.ANSIBLE_LOG_PATH);
      console.log("✅ Created ansible log directory");
    } 

    const uploadSshDir = path.join(process.cwd(), uploadSshKeyDir);
    if (!fs.existsSync(uploadSshDir)) {
      fs.mkdirSync(uploadSshDir, { recursive: true });
      console.log("✅ Created SSH key upload directory");
    }
    console.log("✅ Setup project successfully!");
  } catch (error) {
    console.error('❌ Setup project error:', error);
    process.exit(1); // Exit process on failure
  }
}

export default setupProject;