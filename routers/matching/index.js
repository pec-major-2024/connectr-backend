import { Router } from 'express';
import { authenticate } from '../../auth/authenticate.js';
import matchingRouter from './matchingRouter.js';

const matchingsRouter = Router();
matchingsRouter.use(authenticate); //add the _id param to every request

matchingsRouter.route("*")
    .all((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Content-Type", "application/json");
        next();
    });

matchingsRouter.use("/", matchingRouter);

export default matchingsRouter;