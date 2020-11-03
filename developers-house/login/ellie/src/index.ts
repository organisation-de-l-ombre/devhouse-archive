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

import { createServer, IncomingMessage, OutgoingMessage, Server } from 'http';
import { routes } from "./endpoints/router";
import morgan from 'morgan';
import * as http from "http";

const logger = morgan('combined');

/*
 * The request process that handles the routing.
 */
const requestProcess = (request: IncomingMessage, response: OutgoingMessage) => {
    if (response instanceof http.ServerResponse) {
        logger(request, response, () => {
            if (Object.keys(routes).includes(request.url)) {
                routes[request.url](request, response);
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
