#!/usr/bin/env node
const fs = require('fs'),
    logFactory = require('./modules/logFactory.js');

const log = logFactory.create('BBB');
const DEV_FILE = '/dev/rpmsg_pru30';
const commands = ['0 255 0 0', '-1 0 0 0'];
const file = fs.createWriteStream(DEV_FILE);
file.write(commands[0]);
file.end(commands[1]);

// commands.forEach(c => {
//     fs.writeFile(DEV_FILE, c, {flag: 'a'}, (err)=>{
//         log.error(err);
//     });
// });
// fs.open(DEV_FILE, 'w', (err,fd)=>{
//});
