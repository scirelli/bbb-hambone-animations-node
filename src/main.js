#!/usr/bin/env node
const {setTimeout} =  require('timers/promises');
const logFactory = require('./modules/logFactory.js'),
    CCKDisplay = require('./modules/CCKDisplay.js');


const log = logFactory.create('BBB');
const config = require('../config.json');  //TODO: Convert main.js to use yargs
//const DEV_FILE = '/dev/rpmsg_pru30';

config.cckConfig.logger = log;
let cck = new CCKDisplay(config.cckConfig);

cck.displayOn(255, 0, 0);

setTimeout(5000).then(()=>{
    cck.displayOff();
});
