/*
 * Entry point of the image generator.
 * ~ Ellie ~
 * A QR-Code and Captcha image generator
 * that helps generate stuff for the oauth flow.
 *
 * ~ Information ~
 * Maintainer: Matthieu
 * Developer: Matthieu
*/

import * as Sentry from "@sentry/node";
import * as http from 'http';
import {createServer, IncomingMessage, OutgoingMessage, Server} from 'http';
import morgan from 'morgan';
import {routes} from "./endpoints/router";

Sentry.init({
  dsn: process.env["SENTRY_DSN"] ?? "Invalid Sentry DSN",
	release: process.env["CI_COMMIT_SHORT_SHA"] ?? "No Commit Short SHA",
  tracesSampleRate: 1.0,
});


const logger = morgan('combined');

/*
 * The request process that handles the routing.
 */
const requestProcess = (request: IncomingMessage, response: OutgoingMessage) => {
    if (response instanceof http.ServerResponse) {
        logger(request, response, () => {
            const url = (request.url as string).split('?')[0];
            if (Object.keys(routes).includes(url)) {
                try {
                    routes[url](request, response);
                } catch (e) {
                    response.end();
                }
            } else {
                response.end();
            }
        });
    }
};

/*
 * Method to start the server.
 */
const startServer = (): Promise<Server> => {
    return new Promise<Server>((resolve) => {
        const server = createServer(requestProcess);
        server.listen(19008, () => {
            resolve(server);
        });
    });
};

/*
 * Start the Ellie server.
 */
startServer()
    .then(() => {
        console.log('[~ Ellie ~] is now listening.');
    })
    .catch((error) => {
        console.log('[~ Ellie ~] Failed to start. : ', error);
		});
