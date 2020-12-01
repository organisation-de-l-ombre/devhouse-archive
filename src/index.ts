import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {ErrorRequestHandler, Request, Response} from "express";
import {Routes} from "./routes";
import {RequestError} from "./utils/RequestError";
createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        app[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    app.get('/_healz', (req, res) => {
        res.json({
            status: 'OK',
        });
    });

    const errorHandler: ErrorRequestHandler = (error: RequestError, req, res, next) => {
        if (error) {
            res.statusCode = error.code;
            res.json({
                code: error.code,
                message: error.message,
                error: error.name
            });
        }
    };
    app.use(errorHandler);

    app.listen(5615);

    console.log("Express server has started on port 3000. Open http://localhost:5615/users to see results");

}).catch(error => console.log(error));
