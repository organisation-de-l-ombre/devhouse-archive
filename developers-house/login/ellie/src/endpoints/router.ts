/*
 * All the routes for Ellie.
 */

import {IncomingMessage, OutgoingMessage} from "http";
import { generateCaptcha } from "./generation/Captcha";
import { generateBlur } from "./generation/Blur";

export type Endpoint = (arg0: IncomingMessage, arg1: OutgoingMessage) => Promise<void>;

interface Router {
    [key: string]: Endpoint;
}

export const routes: Router = {};

routes['/captcha'] = generateCaptcha;
routes['/blur'] = generateBlur;
