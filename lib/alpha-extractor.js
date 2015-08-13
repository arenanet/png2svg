"use strict";

var inherits = require("util").inherits,
    
    Pixel      = require("pixel-stream"),
    BufferList = require("bl");

// this code owes a MASSIVE debt to the color-transform module

function AlphaExtractor() {
    Pixel.apply(this, arguments);

    this.buffer = new BufferList();
}

AlphaExtractor.components = {
    "rgb"   : 3,
    "rgba"  : 4,
    "gray"  : 1,
    "graya" : 2,
    "cmyk"  : 4
};

inherits(AlphaExtractor, Pixel);

AlphaExtractor.prototype._start = function(done) {
    this.size = AlphaExtractor.components[this.format.colorSpace];

    this.format.colorSpace = "rgb";

    return done();
};

AlphaExtractor.prototype._writePixels = function(data, done) {
    this.buffer.append(data);

    // make sure we have enough data
    if (this.buffer.length >= this.size) {
        // handle case where data length is not on a pixel boundary
        var tail = this.buffer.length - (this.buffer.length % this.size);
        var buf = this.buffer.slice(0, tail);
        
        this.buffer.consume(buf.length);
        this.push(this._convert(buf));
    }

    return done();
};

AlphaExtractor.prototype._convert = function(data) {
    var out = new Buffer((data.length / this.size | 0) * 3),
        i   = this.size - 1,
        j   = 0;

    while(data.length - i >= this.size) {
        out[j++] = data[i];
        out[j++] = data[i];
        out[j++] = data[i];

        i += this.size;
    }

    return out;
};

module.exports = AlphaExtractor;
