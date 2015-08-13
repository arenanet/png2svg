"use strict";

var cli    = require("../lib/cli"),
    create = require("../lib/create"),

    argv;

argv = cli.parse();

cli.validate(argv);

create(argv, function(error) {
    if(error) {
        throw error;
    }
});
