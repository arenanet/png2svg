/*jshint node:true, browser:true*/
(function() {
    "use strict";
    //TODO : Support relative paths and fix other command line quirks due to using nw
    //       node-webkit has a bug preventing getting the real cwd: https://github.com/rogerwang/node-webkit/issues/648

    var start    = new Date(),
        SVGNS    = "http://www.w3.org/2000/svg",
        fs       = require("fs"),
        path     = require("path"),
        win      = require("nw.gui").Window.get(),
        le       = require("os").endianness() === "LE",
        cli      = require("./lib/cli.js"),
        args     = cli.args,
        quality  = args.q,
        filePath = args.f,
        outPath  = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath))) + ".svg",
        image    = document.createElement("img"),
        buildSVG;

    buildSVG = function(canvas) {
        var width  = canvas.width,
            height = canvas.height * 0.5,
            svg    = document.createElementNS(SVGNS, "svg"),
            defs   = document.createElementNS(SVGNS, "defs"),
            mask   = document.createElementNS(SVGNS, "mask"),
            use    = document.createElementNS(SVGNS, "use"),
            image  = document.createElementNS(SVGNS, "image");
        
        // Add all the svg elements
        svg.appendChild(defs);
            defs.appendChild(mask);
                mask.appendChild(use);
        svg.appendChild(image);

        // Set their attributes
        svg.setAttribute("xmlns", SVGNS);
        svg.setAttribute("width", width);
        svg.setAttribute("height", height);
        svg.setAttribute("preserveAspectRatio", "none");
        svg.setAttribute("viewBox", "0 0 " + width + " " + height);
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

        mask.setAttribute("id", "mask");

        use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#image");
        use.setAttribute("width", width);
        use.setAttribute("height", height);
        use.setAttribute("x", 0);
        use.setAttribute("y", -height);
        
        image.setAttribute("id", "image");
        image.setAttribute("mask", "url(#mask)");
        image.setAttribute("width", width);
        image.setAttribute("height", height * 2);

        image.setAttributeNS("http://www.w3.org/1999/xlink", "A:href", canvas.toDataURL(args.p ? "image/webp" : "image/jpeg", quality));
        
        return svg.outerHTML;
    };

    if(!cli.valid) {
        return;
    }

    image.src = filePath;
    cli.out("Loading " + filePath);
    image.onload = function() { 
        var canvas   = document.createElement("canvas"),
            context  = canvas.getContext("2d"),
            imagedata, buf32, imgLen, i, alphaByte;

        canvas.width  = image.naturalWidth;
        canvas.height = image.naturalHeight * 2;

        // Draw the image twice, the bottom one will be the mask
        context.drawImage(image, 0, 0);
        context.drawImage(image, 0, image.naturalHeight);

        imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
        
        buf32  = new Uint32Array(imagedata.data.buffer);
        imgLen = buf32.length / 2;

        // Ugly loop, but speeds things up for big images
        for (i = buf32.length; --i >= 0; ) {
            if(i < imgLen) {
                // Make sure the image has alpha 1 everywhere - otherwise transparency turns out a bit off
                buf32[i] |= le ? 0xff000000 : 0xff;
                continue;
            }
            
            // Create a grayscale mask - sets alpha to 1 & copies the alpha byte to RGB
            alphaByte = le ? (buf32[i] >>> 24) : buf32[i];
            if(le) {
                buf32[i] = 0xff000000 | (alphaByte << 16) | (alphaByte << 8) | alphaByte;
            } else {
                buf32[i] = 0xff | (alphaByte << 24) | (alphaByte << 16) | (alphaByte << 8);
            }
            
        }

        // Replace the bottom image with the mask
        context.putImageData(imagedata, 0, 0);

        fs.writeFile(outPath, buildSVG(canvas), function(err,a) {
            var inFile, outFile;

            if(err) {
                cli.help(err);
            } else {
                inFile  = fs.statSync(filePath);
                outFile = fs.statSync(outPath);
                cli.out("Successfully Wrote " + outPath);
                cli.out("quality: " + quality);
                cli.out("original size: " + (inFile.size / 1024).toFixed(2) + " KB");
                cli.out("compressed SVG size: " + (outFile.size / 1024).toFixed(2) + " KB (" + (outFile.size / inFile.size * 100).toFixed(1) + "% of original)");
                cli.out((Date.now() - start) + "ms elapsed");
            }

            if(!args.s) {
                win.close();
            }
        });
    };
}());