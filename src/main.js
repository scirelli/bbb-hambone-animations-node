#!/usr/bin/env node
const fs = require('fs/promises'),
    logFactory = require('./modules/logFactory.js');

const log = logFactory.create('BBB');
const DEV_FILE = '/dev/rpmsg_pru30';

(async ()=>{
    try {
        const content = '0 0 0 0\n-1 0 0 0\n';
        await fs.writeFile(DEV_FILE, content, {flag: 'a'});
    } catch (err) {
        log(err);
    }
})();
