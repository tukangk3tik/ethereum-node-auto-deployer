import fs from 'fs';

async function setupProject() {
  try {
    if (!fs.existsSync(process.env.ANSIBLE_LOG_PATH)) {
      fs.mkdirSync(process.env.ANSIBLE_LOG_PATH);
      console.log("✅ Created ansible log directory");
    }
    console.log("✅ Setup project successfully!");
  } catch (error) {
    console.error('❌ Setup project error:', error);
    process.exit(1); // Exit process on failure
  }
}

export default setupProject;