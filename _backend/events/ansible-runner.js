import { spawn } from "child_process";
import EventEmitter from "events";
import fs from "fs";

class AnsibleRunner extends EventEmitter {
  /**
   * @param {string} playbook - ansible-playbook file name (e.g. 'playbook.yml')
   * @param {string[]} args - ansible-playbook args (e.g. ['playbook.yml', '-i', 'host,', '--user', 'ubuntu', ...])
   * @param {string} logsName - log file name (optional)
   * @param {string} cwd - working directory (optional)
   */
  run(playbook, args, logsName, cwd = process.cwd()) {
    const ansiblePlaybookPath = process.env.ANSIBLE_WORKING_DIR_PATH + `/${playbook}`;
    const cmd = spawn('ansible-playbook', [ansiblePlaybookPath, ...args], { cwd });
    const logStream = fs.createWriteStream(process.env.ANSIBLE_LOG_PATH + `/${logsName}`, { flags: 'a' });
    
    const writeLog = (line) => {
      const formatted = `${line}`;
      logStream.write(formatted + '\n');
    }

    cmd.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          writeLog(line);
          this.emit('stdout', line);
        }
      }
    });
    
    cmd.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          writeLog(line);
          this.emit('stderr', line);
        }
      }
    });
    
    cmd.on('close', (code) => {
      writeLog(`Exit code: ${code}`);
      logStream.end();
      this.emit('done', code);
    });

    cmd.on('error', (error) => {
      writeLog(error.message);
      logStream.end();
      this.emit('error', error);
    });
  }
}

export default AnsibleRunner;