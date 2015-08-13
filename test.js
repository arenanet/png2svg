"use strict";

var fs  = require("fs"),
    PNG = require("png-stream/decoder"),
    JPG = require("jpg-stream/encoder"),
    Color = require("color-transform"),
    Alpha = require("./lib/alpha-extractor"),
    template = require("lodash.template"),
    asq = require("asynquence"),
    concat = require("concat-stream"),
    
    alpha = new Alpha(),
    argv  = require("./lib/cli");

console.log(argv);

asq()
    .gate(
        function(done) {
            fs.createReadStream("../../../Desktop/gw.png")
                .pipe(new PNG())
                .pipe(alpha)
                .pipe(new JPG({ quality : 83 }))
                .pipe(concat(done));
        },
        function(done) {
            fs.createReadStream("../../../Desktop/gw.png")
                .pipe(new PNG())
                .pipe(new Color("rgb"))
                .pipe(new JPG({ quality : 83 }))
                .pipe(concat(done));
        }
    )
    .then(function(done, mask, image) {
        var svg = template(fs.readFileSync("./lib/svg-template.xml", "utf8"))({
                width  : alpha.format.width,
                height : alpha.format.height,
                image  : image.toString("base64"),
                mask   : mask.toString("base64")
            });

        fs.writeFileSync("./output.svg", svg);
    });

