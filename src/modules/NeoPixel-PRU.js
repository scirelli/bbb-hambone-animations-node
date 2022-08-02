const fs = require('fs'),
    logFactory = require('./logFactory.js'),
    {setTimeout} =  require('timers/promises');


const DEFAULT_LOGGER = logFactory.create('NEOPIXEL'),
    DEFAULT_LED_COUNT = 42,
    DEFAULT_FILE_MODE = 'w',
    DEFAULT_DEV_FILE = '/dev/rpmsg_pru30',
    SEGMENT_COUNT = 4,
    SEGMENT_ALL = 0,
    SEGMENT_ONE = 1,
    SEGMENT_TWO = 2,
    SEGMENT_THREE = 3;

class Color {
    constructor(r=0, g=0, b=0) {
        this.r = parseFloat(r) || 0.0;
        this.g = parseFloat(g) || 0.0;
        this.b = parseFloat(b) || 0.0;
    }

    toString() {
        return `${Math.floor(this.r)} ${Math.floor(this.g)} ${Math.floor(this.b)}`;
    }
};
module.exports.Color = Color;

module.exports.NeoPixelPRU = class NeoPixelPRU {
    static Color = Color;
    static SEGMENT_COUNT = SEGMENT_COUNT;
    static SEGMENT_ALL = SEGMENT_ALL;
    static SEGMENT_ONE = SEGMENT_ONE;
    static SEGMENT_TWO = SEGMENT_TWO;
    static SEGMENT_THREE = SEGMENT_THREE;

    constructor(config) {
        this.fileName = config.fileName || DEFAULT_DEV_FILE;
        this.fileMode = config.fileMode || DEFAULT_FILE_MODE;
        this.log = config.logger || DEFAULT_LOGGER;
        this.ledCount = parseInt(config.ledCount) || DEFAULT_LED_COUNT;

        this.colorDestinationBufferIndex = this.ledCount;
        this.segmentStartIndex = this.ledCount + this.ledCount;
        this.segmentOneIndex = this.segmentStartIndex;
    }
    
    setLogger(logger) {
        this.logger = logger;
        return this;
    }

    setColor(index, r, g, b) {
        if(!this.isValidDisplayIndex(index)) {
            this.log.warn(new Error('Index out of range.'));
            return this;
        }
        if(r instanceof Color){
            let c = r;
            r = Math.floor(c.r); g = Math.floor(c.g); b = Math.floor(c.b);
        }

        this.write(`${index} ${r} ${g} ${b}`);
        return this;
    }

    setDestinationColor(index, r, g, b) {
        if(!this.isValidDisplayIndex(index)) {
            this.log.warn(new Error('Index out of range.'));
            return this;
        }
        if(r instanceof Color){
            let c = r;
            r = Math.floor(c.r); g = Math.floor(c.g); b = Math.floor(c.b);
        }

        this.write(`${this.colorDestinationBufferIndex + index} ${r} ${g} ${b}`);
        return this;
    }

    setSegment(index, r, g, b) {
        if(!isValidSegmentIndex(index)) {
            this.log.warn(new Error('Invalid segment index'));
            return this;
        }
        if(r instanceof Color) {
            let c = r;
            r = Math.floor(c.r); g = Math.floor(c.g); b = Math.floor(c.b);
        }
        this.write(`${index} ${r} ${g} ${b}`);
        return this;
    }

    isValidDisplayIndex(index) {
        return index >= 0 && index < this.ledCount;
    }

    isValidSegmentIndex(index) {
        return index >=0 && index < SEGMENT_COUNT;
    }

    clear() {
        this.write('-2 0 0 0');
        return this;
    }

    draw() {
        this.write('-1 0 0 0');
        return this;
    }

    write(str) {
        fs.writeFileSync(this.fileName, str + '\n', {flag: this.fileMode});
        return this;
    }
};
