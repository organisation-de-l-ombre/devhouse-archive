/*
 * Entrypoint of the image generator.
 * ~ Ellie ~
 * A QR-Code and Captcha image generator
 * that helps generate stuff for the oauth flow.
 *
 * ~ Information ~
 * Maintainer: Matthieu
 * Developer: Matthieu
 */

import * as http from 'http';
import {createServer, IncomingMessage, OutgoingMessage, Server} from 'http';
import {routes} from "./endpoints/router";
import morgan from 'morgan';

const logger = morgan('combined');

/*
 * The request process that handles the routing.
 */
const requestProcess = (request: IncomingMessage, response: OutgoingMessage) => {
    if (response instanceof http.ServerResponse) {
        logger(request, response, () => {
            const url = request.url.split('?')[0];
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
