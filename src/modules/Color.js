module.exports.Color = class Color{
    constructor(r=0, g=0, b=0) {
        this.r = parseFloat(r) || 0.0;
        this.g = parseFloat(g) || 0.0;
        this.b = parseFloat(b) || 0.0;
    }

    toString() {
        return `${Math.floor(this.r)} ${Math.floor(this.g)} ${Math.floor(this.b)}`;
    }
};

module.exports. HSVtoRGB = function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r=v, g=t, b=p; break;
        case 1: r=q, g=v, b=p; break;
        case 2: r=p, g=v, b=t; break;
        case 3: r=p, g=q, b=v; break;
        case 4: r=t, g=p, b=v; break;
        case 5: r=v, g=p, b=q; break;
    }
    return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
};
