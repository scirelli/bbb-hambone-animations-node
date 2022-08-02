const logFactory = require('./logFactory.js'),
    {NeoPixelPRU} = require('./NeoPixel-PRU.js'),
    {HSVtoRGB} = require('./Color.js');

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

    setDisplayColor(r, g, b) {
        return this.setSegment(CCKDisplay.displaySegmentIndex, r, g, b);
    }
    displayOff() {
        return this.setSegment(CCKDisplay.displaySegmentIndex, ...CCKDisplay.COLORS.OFF);
    }

    setScannerColor(r, g, b) {
        return this.setSegment(CCKDisplay.scannerSegmentIndex, r, g, b);
    }
    scannerOff() {
        return this.setSegment(CCKDisplay.scannerSegmentIndex, ...CCKDisplay.COLORS.OFF);
    }

    setPresenterColor(r, g, b) {
        return this.setSegment(CCKDisplay.presenterSegmentIndex, r, g, b);
    }
    presenterOff() {
        return this.setSegment(CCKDisplay.presenterSegmentIndex, ...CCKDisplay.COLORS.OFF);
    }

    setAllSegmentsColor(r, g, b) {
        this.setDisplayColor(r, g, b);
        this.setScannerColor(r, g, b);
        this.setPresenterColor(r, g, b);
        return this;
    }
    allSegmentsOff() {
        this.displayOff();
        this.scannerOff();
        this.presenterOff();
        return this;
    }

    presenterTimeoutPercentage(percent) {
        let rgb = CCKDisplay.fadeGreenDownToRed(percent);
        return this.setPresenterColor(rgb.r, rgb.g, rgb.b);
    }

    setSegment(index, r, g, b) {
        this.neopixelController.setSegment(index, r, g, b);
        return this;
    }

    static fadeGreenDownToRed(percentage) {
        return HSVtoRGB(120*percentage/360, 1.0, 1.0);
    }
};
