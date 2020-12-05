/*
 * All the routes for Ellie.
 */

import {IncomingMessage, OutgoingMessage} from "http";
import {generateCaptcha} from "./generation/Captcha";
import {generateBlur} from "./generation/Blur";
import {avatar} from "./generation/Avatar";
import {avatarLink} from "./generation/AvatarLink";

export type Endpoint = (arg0: IncomingMessage, arg1: OutgoingMessage) => Promise<void>;

interface Router {
    [key: string]: Endpoint;
}

export const routes: Router = {};

routes['/captcha'] = generateCaptcha;
routes['/blur'] = generateBlur;
routes['/avatar-link'] = avatarLink;
routes['/avatar-upload'] = avatar;

routes['/_healz'] = (req, res) => {
    res.end();
    return Promise.resolve();
};
