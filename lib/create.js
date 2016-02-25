"use strict";

var fs   = require("fs"),
    path = require("path"),
    
    series   = require("run-series"),
    PNG      = require("png-stream"),
    JPG      = require("jpg-stream"),
    Color    = require("color-transform"),
    template = require("lodash.template"),
    concat   = require("concat-stream"),
    
    Alpha  = require("./alpha-extractor"),
    
    alpha = new Alpha(),
    tmpl  = template(
        fs.readFileSync(path.join(__dirname, "./svg-template.xml"), "utf8")
    );

module.exports = function(args, done) {
    series([
        function(cb) {
            // Extract alpha values into a JPG
            fs.createReadStream(args.input)
                .pipe(new PNG.Decoder())
                .pipe(alpha)
                // This needs to be a PNG
                .pipe(new PNG.Encoder())
                .pipe(concat(function(mask) {
                    return cb(null, mask);
                }));
        },
        
        function(cb) {
            // Extract RGB values into a JPG
            fs.createReadStream(args.input)
                .pipe(new PNG.Decoder())
                .pipe(new Color("rgb"))
                .pipe(new JPG.Encoder({ quality : args.quality }))
                .pipe(concat(function(image) {
                    return cb(null, image);
                }));
        }
    ], function(err, results) {
        if(err) {
            return done(err);
        }
        
        fs.writeFileSync(args.output.replace(path.extname(args.output), ".img.jpg"), results[1]);
        fs.writeFileSync(args.output.replace(path.extname(args.output), ".mask.png"), results[0]);
        
        // Write out SVG w/ base64 encoded JPGs and image dimensions from template
        return fs.writeFile(
            args.output,
            tmpl({
                width  : alpha.format.width,
                height : alpha.format.height,
                mime   : PNG.mime,
                image  : results[1].toString("base64"),
                mask   : results[0].toString("base64")
            }),
            done
        );
    });
};
