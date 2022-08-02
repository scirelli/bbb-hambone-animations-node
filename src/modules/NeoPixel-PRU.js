const fs = require('fs'),
    logFactory = require('./modules/logFactory.js'),
    {setTimeout} =  require('timers/promises');


const DEFAULT_LOGGER = logFactory.create('NEOPIXEL'),
    DEFAULT_LED_COUNT = 42,
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
}

module.exports = class NeoPixelPRU {
    constructor(config) {
        this.fileName = config.fileName || DEFAULT_DEV_FILE;
        this.log = config.logger || DEFAULT_LOGGER;
        this.ledCount = parseInt(config.ledCount) || DEFAULT_LED_COUNT;
        this.display = (new Array(this.ledCount)).fill(0).map(_=>new Color());
        this.destinationBuffer = (new Array(this.ledCount)).fill(0).map(_=>new Color());
        this.colorDestinationBufferIndex = this.ledCount;
        this.segmentStartIndex = this.ledCount + this.ledCount;
        this.segmentOneIndex = this.segmentStartIndex;
    }
    
    setColor(index, r, g, b) {
        if(!this.isValidDisplayIndex()) {
            this.log.warn(new Error('Index out of range.'));
            return this;
        }
        if(r instanceof Color){
            let c = r;
            r = c.r; g = c.g; b = c.b;
        }

        this.display[index].r = r;
        this.display[index].g = g;
        this.display[index].b = b;
        return this;
    }

    getColor(index) {
        return this.display[index];
    }
    
    setSegmentNow(index, r, g, b) {
        if(!isValidSegmentIndex) {
            this.log.warn(new Error('Invalid segment index');
            return this;
        }
        if(r instanceof Color) {
            let c = r;
            r = c.r; g = c.g; b = c.b;
        }
        fs.writeFileSync(this.fileName, `${index} ${r} ${g} ${b}`, {flag: 'w'});
        return this;
    }

    isValidDisplayIndex(index) {
        return index >= 0 && index < this.display.displayLength;
    }

    isValidSegmentIndex(index) {
        return index >=0 && index < SEGMENT_COUNT;
    }

    clear() {
        fs.writeFileSync(this.fileName, '-2 0 0 0', {flag: 'w'});
        return this;
    }

    draw() {
        display.forEach((color, index) => {
            fs.writeFileSync(this.fileName, `${index} ${color}`, {flag: 'w'});
        });
        fs.writeFileSync(this.fileName, `-1 0 0 0`, {flag: 'w'});
        return this;
    }
};
