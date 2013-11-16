var filesystem = require('fs');
var configFileName = 'config.json';

config = {
    init: function() {
        var configFile;
        try {
            var configFile = filesystem.readFileSync(configFileName);
        } catch (e) {
            console.error('No config found for file <', configFileName, '>');
        }
        return configFile ? JSON.parse(configFile.toString()) : {};
    }
};

console.log(config.init().mysql.database);

module.exports = config;
