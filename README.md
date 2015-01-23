# png2svg
This is a simple tool invoked from the command line which converts a png into an svg that uses jpeg compression.  This can significantly reduce image sizes for use on the web.

## Installation
Download and unzip the built version, then invoke from the command line or run as a node-webkit app.  Warning: Only the Windows version has been tested

## Usage
```bat
d:\png2svg\png2svg.exe -f d:/image.png -q 70
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

