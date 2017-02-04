# png2svg

[![Greenkeeper badge](https://badges.greenkeeper.io/arenanet/png2svg.svg)](https://greenkeeper.io/)
This is a simple tool invoked from the command line which converts a png into an svg that uses jpeg compression.  This can significantly reduce image sizes for use on the web.

## Installation
Download and unzip the built version, then invoke from the command line or run as a node-webkit app.

#### Downloads
   * Windows: [32bit](https://github.com/arenanet/png2svg/releases/download/0.1.0/png2svg-win32.zip) - [64bit](https://github.com/arenanet/png2svg/releases/download/0.1.0/png2svg-win64.zip)
   * OSX(not tested/supported): [32bit](https://github.com/arenanet/png2svg/releases/download/0.1.0/png2svg-osx32.zip) - [64bit](https://github.com/arenanet/png2svg/releases/download/0.1.0/png2svg-osx64.zip)
   * Linux(not tested/supported): [32bit](https://github.com/arenanet/png2svg/releases/download/0.1.0/png2svg-linux32.tar.gz) - [64bit](https://github.com/arenanet/png2svg/releases/download/0.1.0/png2svg-linux64.tar.gz)

## Usage
```bat
d:\png2svg\png2svg.exe -f d:/image.png -q 0.7
```

#### Options
    -f, --file          Absolute path to png file to convert into an svg
    -q, --quality       Image quality, 0-1 (default 0.83)
    -s, --show          Keep the node-webkit window open when finished
    -p, --webp          Use webp instead of jpeg for the embedded dataUrl

#### Notes/tips
   * You must provide an absolute file path
   * The generated svg file will be written to the same directory with the same name as the png, but with the .svg extension
   * Use -s to show info/errors (I'd prefer to have all the interaction via command line, but node-webkit doesn't have support for this)
   * Make sure your server gzips svgs!

***
###### Related / Thanks
   * Inspired by http://quasimondo.com/ZorroSVG/ - Thanks [@quasimondo](http://twitter.com/quasimondo)
   * http://peterhrynkow.com/how-to-compress-a-png-like-a-jpeg/
   * http://codepen.io/shshaw/full/tKpdl
