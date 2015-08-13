"use strict";

var fs   = require("fs"),
    args = require("minimist")(process.argv.slice(2), {
        "default" : {
            q : 83
        },
        
        alias : {
            q : "quality",
            h : "help"
        }
    });

function help(error) {
    if(error) {
        console.error("Error: " + error);
    }

    console.log("png2svg\n");
    console.log("Convert & optimize a PNG into an SVG using an embedded jpeg + mask\n");
    console.log("Usage:");
    console.log("    png2svg [options] <input> <output>");
    console.log("Options: ");
    console.log("    -q, --quality  JPEG quality level (1-100) [default: 83]");
    
    process.on("exit", function() {
        process.exit(error ? 1 : 0); 
    });
}

console.log(args);

// Validate command line args
if(args.help) {
    return help();
}

if(!fs.existsSync(args._[0])) {
    return help("Invalid file: " + args._[0]);
}

if(args.quality < 1 || args.quality > 100) {
    return help("Invalid quality: " + args.quality);
}

module.exports = args;
