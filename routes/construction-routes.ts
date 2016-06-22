'use strict';
import * as express from 'express';

class Construction {
    public static get(req: express.Request, res: express.Response) {
        res.json({
            success: true,
            imageURL: 'images/underconstruction.gif'
        });
    }
}

export default Construction;
