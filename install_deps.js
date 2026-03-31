const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const deps = [
  'react-native-agora',
  'socket.io-client',
  '@tanstack/react-query',
  'lucide-react-native',
  '@gorhom/bottom-sheet',
  'react-native-reanimated',
  'react-native-gesture-handler'
];

const logFile = path.join(__dirname, 'install_log.txt');

function log(msg) {
  const timestamp = new Date().toISOString();
  const formattedMsg = `[${timestamp}] ${msg}\n`;
  console.log(formattedMsg);
  fs.appendFileSync(logFile, formattedMsg);
}

fs.writeFileSync(logFile, 'Starting installation...\n');

deps.forEach(dep => {
  try {
    log(`Installing ${dep}...`);
    // Use npm install directly to avoid npx overhead/issues
    execSync(`npm install ${dep} --save`, { stdio: 'inherit', cwd: __dirname });
    log(`Successfully installed ${dep}`);
  } catch (error) {
    log(`Failed to install ${dep}: ${error.message}`);
  }
});

log('Installation process completed.');
