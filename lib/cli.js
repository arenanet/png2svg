"use strict";

var fs   = require("fs"),
    path = require("path");

exports.parse = function() {
    var argv = require("minimist")(process.argv.slice(2), {
            "default" : {
                q : 83
            },
            
            alias : {
                q : "quality",
                h : "help"
            }
        });

    if(argv.help) {
        console.log("png2svg\n");
        console.log("Convert & optimize a PNG into an SVG using an embedded jpeg + mask\n");
        console.log("Usage:");
        console.log("    png2svg [options] <input> <output>\n");
        console.log("Options: ");
        console.log("    -q, --quality  JPEG quality level (1-100) [default: 83]");

        process.exit(0);
    }


    if(!argv._ || !argv._.length === 2) {
        return false;
    }

    argv.input  = path.resolve(argv._[0]);
    argv.output = path.resolve(argv._[1]);

    return argv;
};

exports.validate = function(argv) {
    if(!argv || typeof argv !== "object") {
        throw new Error("Invalid args object");
    }

    if(!argv.input || !fs.existsSync(argv.input)) {
        throw new Error("Invalid input file " + argv.input);
    }

    if(!argv.output) {
        throw new Error("Must specify an output file");
    }

    if(!argv.quality || argv.quality < 1 || argv.quality > 100) {
        throw new Error("Invalid quality " + argv.quality);
    }
};
