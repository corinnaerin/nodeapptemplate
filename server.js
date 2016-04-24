const express = require('express');

const ipaddress = "127.0.0.1" ;
const port = 8080;

const app = express();
const router = express.Router();

require('./routes/construction-routes')(router);
app.use('/api', router);

app.use(express.static(__dirname + '/dist')); //Serve up static content

//Start the app on the specific interface (and port).
app.listen(port, ipaddress, () => {
    console.log(`${new Date(Date.now())}: Node server started on ${ipaddress}:${port} ...`);
});