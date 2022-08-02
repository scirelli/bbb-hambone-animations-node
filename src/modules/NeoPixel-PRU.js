const fs = require('fs'),
    logFactory = require('./logFactory.js'),
    {Color} = require('./Color.js');


const DEFAULT_LOGGER = logFactory.create('NEOPIXEL'),
    DEFAULT_LED_COUNT = 42, // Defined in PRU. This is the max number of LEDs unless changed in PRU firmware.
    DEFAULT_FILE_MODE = 'w',
    DEFAULT_DEV_FILE = '/dev/rpmsg_pru30',
    SEGMENT_COUNT = 4,      // Defined in PRU
    SEGMENT_ALL = 0,        // Defined in PRU
    SEGMENT_ONE = 1,        // Defined in PRU
    SEGMENT_TWO = 2,        // Defined in PRU
    SEGMENT_THREE = 3;      // Defined in PRU


module.exports.NeoPixelPRU = class NeoPixelPRU{
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

    setColorBuffer(index, r, g, b) {
        if(!this.isValidDisplayIndex(index)) {
            this.log.warn(new Error('Index out of range.'));
            return this;
        }
        if(r instanceof Color) {
            let c = r;
            r = Math.floor(c.r); g = Math.floor(c.g); b = Math.floor(c.b);
        }

        this.write(`${index} ${r} ${g} ${b}`);
        return this;
    }

    setColor(/*index, r, g, b*/) {
        this.setColorBuffer.apply(this, arguments);
        this.draw();
        return this;
    }

    setDestinationColorBuffer(index, r, g, b) {
        if(!this.isValidDisplayIndex(index)) {
            this.log.warn(new Error('Index out of range.'));
            return this;
        }
        if(r instanceof Color) {
            let c = r;
            r = Math.floor(c.r); g = Math.floor(c.g); b = Math.floor(c.b);
        }

        this.write(`${this.colorDestinationBufferIndex + index} ${r} ${g} ${b}`);
        return this;
    }

    setDestinationColor(/*index, r, g, b*/) {
        this.setDestinationColorBuffer.apply(this, arguments);
        this.draw();
        return this;
    }

    setSegmentBuffer(index, r, g, b) {
        if(!this.isValidSegmentIndex(index)) {
            this.log.warn(new Error('Invalid segment index'));
            return this;
        }
        if(r instanceof Color) {
            let c = r;
            r = Math.floor(c.r); g = Math.floor(c.g); b = Math.floor(c.b);
        }
        this.write(`${index + this.segmentStartIndex} ${r} ${g} ${b}`);
        return this;
    }

    setSegment(index, r, g, b) {
        this.setSegmentBuffer(index, r, g, b);
        this.draw();
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
