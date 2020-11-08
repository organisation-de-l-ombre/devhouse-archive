/*
 * Runs the server.
 */

import Server from "./Server";

new Server(parseInt(process.env.PORT || '8080'));
