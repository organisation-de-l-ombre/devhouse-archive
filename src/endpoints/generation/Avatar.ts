/*
 * Generate a captcha with a given string.
 */

import {Endpoint} from '../router';
import sharp from "sharp";

export const avatar: Endpoint = async (request, response) => {
    if (request.method !== 'POST') return;
    const d = sharp()
        .resize(250, 250)
        .toBuffer(() => {
        });
    d.pipe(response);
    request.pipe(d);
};
