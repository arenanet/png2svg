"use strict";

var fs  = require("fs"),
    PNG = require("png-stream/decoder"),
    JPG = require("jpg-stream/encoder"),
    Color = require("color-transform"),
    Alpha = require("./lib/alpha-extractor"),
    template = require("lodash.template"),
    ASQ = require("asynquence"),
    concat = require("concat-stream");

ASQ()
    .gate(
        function(done) {
            fs.createReadStream("./alert.png")
                .pipe(new PNG())
                .pipe(new Alpha())
                .pipe(new JPG())
                .pipe(concat(done));
        },
        function(done) {
            fs.createReadStream("./alert.png")
                .pipe(new PNG())
                .pipe(new Color("rgb"))
                .pipe(new JPG())
                .pipe(concat(done));
        }
    )
    .then(function(done, mask, image) {
        // TODO: determine image dimensions
        var svg = template(fs.readFileSync("./lib/svg-template.xml", "utf8"))({
                width  : 16,
                height : 16,
                image  : image.toString("base64"),
                mask   : mask.toString("base64")
            });

        console.log(svg); // TODO: REMOVE DEBUGGING

        fs.writeFileSync("./output.svg", svg);
    });

