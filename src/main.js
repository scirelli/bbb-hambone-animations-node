#!/usr/bin/env node
const {setTimeout} =  require('timers/promises');
const logFactory = require('./modules/logFactory.js'),
    {NeoPixelPRU} = require('./modules/NeoPixel-PRU.js');


const log = logFactory.create('BBB');
const DEV_FILE = '/dev/rpmsg_pru30';
//const DEV_FILE = '/tmp/rpmsg_pru30.txt';

let np = new NeoPixelPRU({
    fileName: DEV_FILE,
    fileMode: 'a',
    ledCount: 42,
    logger: log
});

np.setColor(0, 255, 0, 0);

setTimeout(5000).then(()=>{
    np.setColor(0, 0, 0, 0);
});
