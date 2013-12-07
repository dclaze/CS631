var fs = require('fs'),
    path = require('path');

var requireRouteFile = function(app, argv, parentDirectory) {
    console.log('Adding routes from', parentDirectory);
    require('./' + parentDirectory)(app, argv);
};

var scanDirectoryForIndexFiles = function(app, argv, currentPath) {
    var files = fs.readdirSync(currentPath);

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file[0] != '.') {
            if (file == 'index.js') {
                requireRouteFile(app, argv, path.relative(__dirname, currentPath));
            } else {
                filePath = path.join(currentPath, file);
                stat = fs.statSync(filePath);
                if (stat.isDirectory())
                    scanDirectoryForIndexFiles(app, argv, filePath);
            }
        }
    }
};

module.exports = function(app, argv) {
    scanDirectoryForIndexFiles(app, argv, __dirname);
};