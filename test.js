"use strict";

var fs  = require("fs"),
    PNG = require("png-stream/decoder"),
    JPG = require("jpg-stream/encoder"),
    Color = require("color-transform"),
    Alpha = require("./lib/alpha-extractor");

fs.createReadStream("./alert.png")
    .pipe(new PNG())
    .pipe(new Alpha())
    .pipe(new JPG())
    .pipe(fs.createWriteStream('./mask.jpg'));

fs.createReadStream("./alert.png")
    .pipe(new PNG())
    .pipe(new Color("rgb"))
    .pipe(new JPG())
    .pipe(fs.createWriteStream('./contents.jpg'));
