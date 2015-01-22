/*jshint node:true, browser:true*/
"use strict";

var fs       = require("fs"),
    gui      = global.window.nwDispatcher.requireNwGui(),
    win      = gui.Window.get(),
    minimist = require("minimist"),
    path     = require("path"),
    args = minimist(gui.App.argv, {
        alias     : { f : "file", q : "quality", h : "help", s : "show", p : "webp" },
        "default" : { q : 0.83 }
    }),
    valid = true,
    out, help;

out = function(text) {
    global.window.document.body.innerHTML += "<p>" + text + "</p>";
};

help = function(errText) {
    if(errText) {
        out("<span style='color:red;'>Error: " + errText + "</span><br/>");
    }

    out("Convert & optimize a PNG into an SVG using an embedded jpeg + mask");
    out("Usage:");
    out("    png2svg -f d:/image.png -q 70");
    out("Options: ");
    out("    -f, --file          Absolute path to png file to convert into an svg");
    out("    -q, --quality       Image quality, 0-1 (default 0.83)");
    out("    -s, --show          Keep the node-webkit window open when finished");
    out("    -p, --webp          Use webp instead of jpeg for the embedded dataUrl");
};

args.f = args.f && path.resolve(args.f);

// Validate command line args
if(args.h) {
    help();
    valid = false;
}

if(!fs.existsSync(args.f)) {
    help("Invalid file: " + args.f);
    if(!args.s) {
        win.close();
    }
    valid = false;
}

if(args.q < 0 || args.q  > 1) {
    help("Invalid quality: " + args.q );
    if(!args.s) {
        win.close();
    }
    valid = false;
}

module.exports = {
    args  : args,
    out   : out,
    help  : help,
    valid : valid
};