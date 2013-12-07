var Sequelize = require('sequelize'),
    fileSystem = require('fs'),
    path = require('path');

module.exports = function(sequelize) {
    var database = {
        Sequelize: Sequelize,
        sequelize: sequelize,
    },
        models = {},
        files = fileSystem.readdirSync(__dirname);

    for (var i = 0; i < files.length; i++) {
        var fileName = files[i].replace('.js', '');
        if (fileName !== "define")
            models[fileName] = sequelize.import(path.join(__dirname, fileName));
    }
    database.models = models;
    return database;
};
