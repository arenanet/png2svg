"use strict";

var fs   = require("fs"),
    path = require("path"),
    
    PNG    = require("png-stream/decoder"),
    JPG    = require("jpg-stream/encoder"),
    Color  = require("color-transform"),
    Alpha  = require("./alpha-extractor"),
    tmpl   = require("lodash.template"),
    asq    = require("asynquence"),
    concat  = require("concat-stream"),
    
    alpha = new Alpha();

module.exports = function(args, done) {
    asq()
        .gate(
            function(cb) {
                // Extract alpha values into a JPG
                fs.createReadStream(args.input)
                    .pipe(new PNG())
                    .pipe(alpha)
                    .pipe(new JPG({ quality : args.quality }))
                    .pipe(concat(cb));
            },
            function(cb) {
                // Extract RGB values into a JPG
                fs.createReadStream(args.input)
                    .pipe(new PNG())
                    .pipe(new Color("rgb"))
                    .pipe(new JPG({ quality : args.quality }))
                    .pipe(concat(cb));
            }
        )
        .then(function(cb, mask, image) {
            // Write out SVG w/ base64 encoded JPGs and image dimensions from template
            fs.writeFileSync(args.output, tmpl(fs.readFileSync(path.join(__dirname, "./svg-template.xml"), "utf8"))({
                width  : alpha.format.width,
                height : alpha.format.height,
                image  : image.toString("base64"),
                mask   : mask.toString("base64")
            }));

            done();
        })
        .or(done);
};
