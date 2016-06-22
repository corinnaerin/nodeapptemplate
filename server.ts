'use strict';

import * as express from 'express';
import Construction from './routes/construction-routes';

class Server {
    constructor() {
        this.app = express();
        this.router = express.Router();
        this.routes();
        this.start();
    }
    
    private app: express.Application;
    private router: express.Router;

    private port: number = process.env.PORT || 5000;
    
    private routes() {
        this.router.get('/construction', Construction.get);
        this.app.use('/api', this.router);
        this.app.use(express.static(__dirname + '/dist')); //Serve up static content
    }

    private start() {
        //Start the app on the specific interface (and port).
        this.app.listen(this.port, () => {
            console.log(`${new Date(Date.now())}: Node server started on ${this.port} ...`);
        });
    }

    public static bootstrap(): Server {
        return new Server();
    }
}

const server: Server = Server.bootstrap();
