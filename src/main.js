#!/usr/bin/env node
const fs = require('fs'),
    logFactory = require('./modules/logFactory.js'),
    {setTimeout} =  require('timers/promises');


const log = logFactory.create('BBB');
const DEV_FILE = '/dev/rpmsg_pru30';
const commands = ['0 255 0 0', '-1 0 0 0', '1 0 255 0', '-1 0 0 0'];

commands.forEach(c => {
    fs.writeFileSync(DEV_FILE, c, {flag: 'w'});
});

setTimeout(2000).then(()=>{
    ['0 0 0 0', '1 0 0 0', '-1 0 0 0'].forEach(c=>{
        fs.writeFileSync(DEV_FILE, c, {flag: 'w'});
    });
});
