var filesystem = require('fs'),
	defaultFileName = 'config.json';

config = {
    init: function(configFileName) {
        configFileName = configFileName || defaultFileName;
        try {
            var configFile = filesystem.readFileSync(configFileName);
        } catch (e) {
            console.error('No config found for file <', configFileName, '>');
        }
        return configFile ? JSON.parse(configFile.toString()) : {};
    }
};

module.exports = config;
