import { spawn } from "child_process";
import EventEmitter from "events";

class AnsibleRunner extends EventEmitter {
  run(inventoryPath, playbookPath) {
    const cmd = spawn('ansible-playbook', [playbookPath, '-i', inventoryPath]);
    
    cmd.stdout.on('data', (data) => {
      this.emit('stdout', data.toString());
    });
    
    cmd.stderr.on('data', (data) => {
      this.emit('stderr', data.toString());
    });
    
    cmd.on('close', (code) => {
      this.emit('done', code);
    });

    cmd.on('error', (error) => {
      this.emit('error', error);
    });
  }
}

export default AnsibleRunner;