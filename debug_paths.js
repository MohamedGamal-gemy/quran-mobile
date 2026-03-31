const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'debug_log.txt');
fs.writeFileSync(logFile, `Dir: ${__dirname}\nCwd: ${process.cwd()}\n`);
console.log('Debug info written.');
