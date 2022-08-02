#!/usr/bin/env node
const fs = require('fs'),
    logFactory = require('./modules/logFactory.js'),
    {setTimeout} =  require('timers/promises');


const log = logFactory.create('BBB');
const DEV_FILE = '/dev/rpmsg_pru30';
const commands = ['0 255 0 0', '-1 0 0 0', '1 0 255 0', '-1 0 0 0'];
const file = fs.createWriteStream(DEV_FILE);

['0 255 0 0', '-1 0 0 0', '1 0 255 0', '-1 0 0 0', '0 0 0 0', '1 0 0 0', '-1 0 0 0'].forEach(c=>{
    file.write(c);
});

setTimeout(10000).then(()=>{
    file.end();
});
