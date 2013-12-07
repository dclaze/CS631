var config = require('./config').init('config.json'),
    sqlConnector = require('./server/mysql_connector_sequelize').init(config.mysql),
    express = require('express'),
    app = express(),
    db = require('./server/models/define')(sqlConnector);


app.use(require('express-promise')())
    .use(express.static(__dirname));
app.use(express.bodyParser());

require('./server/routes.js')(app, db);
console.log(db.models);
app.set('models', db.models);
app.set('port', 54321);

console.log("TEST");
app.listen(app.get('port'));
console.log("Started app on port", app.get('port'));

console.log(process);
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});
// db.sequelize.sync().complete(function(err) {
//     if (err) {
//         throw err
//     } else {
//         console.log("TEST");
//         app.listen(app.get('port'));
//         console.log("Started app on port", app.get('port'));

//         console.log(process);
//         process.on('uncaughtException', function(err) {
//             console.log('Caught exception: ' + err);
//         });
//     }
// });
