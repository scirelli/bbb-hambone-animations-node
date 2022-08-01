#!/usr/bin/env node
const fs = require('fs'),
    logFactory = require('./modules/logFactory.js');

const log = logFactory.create('BBB');
const DEV_FILE = '/dev/rpmsg_pru30';

(async ()=>{
    const commands = ['0 255 0 0\n', '-1 0 0 0\n'];
    commands.forEach(c => {
        fs.writeFile(DEV_FILE, commands[i], {flag: 'a'}, (err)=>{
            log.error(err);
        });
    });
})();
