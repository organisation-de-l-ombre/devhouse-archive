import * as Sentry from "@sentry/node";
import * as bodyParser from "body-parser";
import * as express from "express";
import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import CreateRedis from "ioredis";
import * as morgan from 'morgan';
import RedisMock from 'redis-mock';
import { DataManager } from '@developers-house/lib-datamanager';
import {User} from "./entity/User";
import {Link} from "./entity/Link";
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Routes} from "./routes";
import {RequestError} from "./utils/RequestError";

Sentry.init({
	tracesSampleRate: 1.0,
	dsn: process.env["SENTRY_DSN"] ?? "Invalid Sentry DSN",
	release: process.env["CI_COMMIT_SHORT_SHA"] ?? "No Commit Short SHA"
})

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

const typeOrmClearer = (key: string, value: object) => {
    if (key.startsWith("_")) {
        return undefined;
    }
    return value;
};

// Starts the server after the database.
createConnection().then(async (conn) => {

    const manager = new DataManager({
        async checkIfDataAvailable(userId) {
            const repo = conn.getRepository(User);
            const user = await repo.findOne({
                where: {
                    uuid: userId,
                }
            });
            return user !== undefined;
        },
        async provide(userId) {
            const repo = conn.getRepository(User);
            const user = await repo.findOne({
                where: {
                    uuid: userId,
                },
            });
            const links = await user.links;

            return [
                {
                    name: 'profile.json',
                    data: Buffer.from(JSON.stringify(user, typeOrmClearer), 'utf-8'),
                },
                {
                    name: 'linked-accounts.json',
                    data: Buffer.from(JSON.stringify(links,typeOrmClearer), 'utf-8'),
                },
            ];
        },
    }, 'scarlet');
    manager.start();

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


    const errorHandler: ErrorRequestHandler = (error: RequestError, req: Request, res: Response, next: NextFunction) => {
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
