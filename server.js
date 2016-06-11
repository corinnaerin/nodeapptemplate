const express = require('express');

const port = process.env.PORT || 5000;

const app = express();
const router = express.Router();

require('./routes/construction-routes')(router);
app.use('/api', router);

app.use(express.static(__dirname + '/dist')); //Serve up static content

//Start the app on the specific interface (and port).
app.listen(port, () => {
    console.log(`${new Date(Date.now())}: Node server started on ${port} ...`);
});