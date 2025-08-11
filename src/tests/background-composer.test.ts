import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import * as assert from 'assert';
import * as fs from 'fs';
import { homedir } from 'os';
import { PID_FILE, HOME_DIR } from '../constants';

describe('Background Composer Tests', () => {
    before(async () => {
        // Create test config directory if it doesn't exist
        if (!fs.existsSync(HOME_DIR)) {
            fs.mkdirSync(HOME_DIR, { recursive: true });
        }

        // Create a test config
        const testConfig = {
            PORT: 3001,
            HOST: '127.0.0.1',
            APIKEY: 'test-key',
            Providers: [{
                name: 'test-provider',
                apiKey: 'test-key'
            }]
        };
        fs.writeFileSync(join(HOME_DIR, 'config.json'), JSON.stringify(testConfig, null, 2));

        // Clean up any existing PID file
        if (fs.existsSync(PID_FILE)) {
            try {
                const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'));
                process.kill(pid);
            } catch (e) {
                // Process might already be dead
            }
            fs.unlinkSync(PID_FILE);
        }
    });

    after(() => {
        // Clean up test config and process
        try {
            fs.unlinkSync(join(HOME_DIR, 'config.json'));
            if (fs.existsSync(PID_FILE)) {
                const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'));
                try {
                    process.kill(pid);
                } catch (e) {
                    // Process might already be dead
                }
                fs.unlinkSync(PID_FILE);
            }
        } catch (e) {
            // Ignore cleanup errors
        }
    });

    const waitForPidFile = (timeout = 5000): Promise<void> => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkFile = () => {
                if (fs.existsSync(PID_FILE)) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Timeout waiting for PID file'));
                } else {
                    setTimeout(checkFile, 100);
                }
            };
            checkFile();
        });
    };

    it('should start composer in background mode', async function() {
        this.timeout(10000); // Increase timeout to 10 seconds

        const cliPath = join(process.cwd(), 'dist', 'cli.js');
        const composerProcess = spawn('node', [cliPath, 'start'], {
            env: {
                ...process.env,
                NODE_ENV: 'test',
                BACKGROUND_MODE: 'true'
            },
            detached: true
        });

        return new Promise<void>((resolve, reject) => {
            let output = '';
            
            composerProcess.stdout?.on('data', async (data: Buffer) => {
                output += data.toString();
                console.log('Output:', output);
                // Check if the composer has started successfully
                if (output.includes('LLMs API server listening')) {
                    try {
                        await waitForPidFile();
                        const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'));
                        assert.ok(!isNaN(pid), 'PID should be a valid number');
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            });

            composerProcess.stderr?.on('data', (data: Buffer) => {
                console.error(`Error: ${data}`);
            });

            composerProcess.on('error', (error: Error) => {
                reject(error);
            });

            // Ensure the test doesn't hang
            setTimeout(() => {
                reject(new Error('Timeout waiting for composer to start'));
            }, 8000);
        });
    });
});