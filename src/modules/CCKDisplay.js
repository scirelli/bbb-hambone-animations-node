const logFactory = require('./logFactory.js'),
    {NeoPixelPRU} = require('./NeoPixel-PRU.js'),
    {setInterval} =  require('timers/promises');

const DEFAULT_LOGGER = logFactory.create('CCKDisplay');

module.exports = class CCKDisplay{
    static displaySegmentIndex   = NeoPixelPRU.SEGMENT_ONE;
    static scannerSegmentIndex   = NeoPixelPRU.SEGMENT_TWO;
    static presenterSegmentIndex = NeoPixelPRU.SEGMENT_THREE;
    static FLASH_RATE_MS         = 1000; //On for FLASH_RATE_MS off for FLASH_RATE_MS

    static COLORS = {
        BLACK: [0, 0, 0],
        OFF:   [0, 0, 0],
        RED:   [255, 0, 0],
        GREEN: [0, 255, 0]
    };

    constructor(config) {
        this.log = config.logger || DEFAULT_LOGGER;
        this.neopixelController = new NeoPixelPRU(config.neoPixelConfig);
    }

    displayOn(r, g, b) {
        return this.setSegment(CCKDisplay.displaySegmentIndex, r, g, b);
    }
    displayOff() {
        return this.setSegment(CCKDisplay.displaySegmentIndex, ...CCKDisplay.COLORS.OFF);
    }

    scannerOn(r, g, b) {
        return this.setSegment(CCKDisplay.scannerSegmentIndex, r, g, b);
    }
    scannerOff() {
        return this.setSegment(CCKDisplay.scannerSegmentIndex, ...CCKDisplay.COLORS.OFF);
    }

    presenterOn(r, g, b) {
        return this.setSegment(CCKDisplay.presenterSegmentIndex, r, g, b);
    }
    presenterOff() {
        return this.setSegment(CCKDisplay.presenterSegmentIndex, ...CCKDisplay.COLORS.OFF);
    }

    allSegmentsOn(r, g, b) {
        this.displayOn(r, g, b);
        this.scannerOn(r, g, b);
        this.presenterOn(r, g, b);
        return this;
    }
    allSegmentsOff() {
        this.displayOff();
        this.scannerOff();
        this.presenterOff();
        return this;
    }

    async allErrorFlashing(timeMs) {
        let on = true,
            self = this;

        self.allSegmentsOn(...CCKDisplay.COLORS.RED);
        for await (const startTimeMs of setInterval(CCKDisplay.FLASH_RATE_MS, Date.now())) {
            on = !on;

            if ((Date.now() - startTimeMs) >= timeMs) {
                self.allSegmentsOff();
                break;
            }
            if(on) self.allSegmentsOn(...CCKDisplay.COLORS.RED);
            else self.allSegmentsOff();
        }
    }

    async presenterFlashing(r, g, b, timeMs) {
        return this.segmentFlashing(CCKDisplay.presenterSegmentIndex, timeMs, r, g, b);
    }
    async displayFlashing(r, g, b, timeMs) {
        return this.segmentFlashing(CCKDisplay.displaySegmentIndex, timeMs, r, g, b);
    }
    async scannerFlashing(r, g, b, timeMs) {
        return this.segmentFlashing(CCKDisplay.scannerSegmentIndex, timeMs, r, g, b);
    }

    async checkRetractTimer() {
        //Countdown animation
        //Animation goes from all Green to yellow to red. Red represents time out.
        throw new Error('Not implemented');
    }

    async segmentFlashing(segmentIndex, timeMs, r, g, b) {
        let on = true,
            self = this;

        self.setSegment(segmentIndex, r, g, b);
        for await (const startTimeMs of setInterval(CCKDisplay.FLASH_RATE_MS, Date.now())) {
            on = !on;

            if ((Date.now() - startTimeMs) >= timeMs) {
                self.setSegment(segmentIndex, ...CCKDisplay.COLORS.OFF);
                break;
            }
            if(on) self.setSegment(segmentIndex, r, g, b);
            else self.setSegment(segmentIndex, ...CCKDisplay.COLORS.OFF);
        }
    }

    setSegment(index, r, g, b) {
        this.neopixelController.setSegment(index, r, g, b);
        return this;
    }
};
