import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {Routes} from "./routes";
import {RequestError} from "./utils/RequestError";
import CreateRedis from "ioredis";
import * as morgan from 'morgan';
import RedisMock from 'redis-mock';

const firstRedisNode: { host: string; port: number } = {
    host: process.env["REDIS_HOST"] || 'localhost',
    port: parseInt(process.env["REDIS_PORT"] || "6379"),
};

const provideRedis = () => {
    if (process.env.NODE_ENV === 'production') {
        return new CreateRedis({
            sentinels: [
                firstRedisNode,
            ],
            sentinelPassword: process.env["REDIS_PASSWORD"],
            name: "mymaster",
        });
    }
    return RedisMock;
}

// Starts the server after the database.
createConnection().then(async () => {
    const app = express();

    const redis = provideRedis();

    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        app[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
            new route.controller(redis)[route.action](req as Request<any, any, any>, res, next);
        });
    });

    app.get('/_healz', (req, res) => {
        res.json({
            status: 'OK',
        });
    });


    const errorHandler: ErrorRequestHandler = (error: RequestError, req, res) => {
        if (error.code) {
            res.json({
                code: error.code,
                message: error.message,
                error: error.name
            });
        }
        else {
            res.json(error.message);
        }
    };
    const port = process.env.PORT || 5000;
    app.use(errorHandler);
    app.listen(port);
}).catch(error => console.log(error));
