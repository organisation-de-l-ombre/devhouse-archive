/*
 * Generate a captcha with a given string.
 */

import { Endpoint } from '../router';
import Sharp from 'sharp';


export const generateBlur: Endpoint = async (request, response) => {

    if (request.method !== 'POST') return;

    // The image builder.
    const sharp = Sharp()
        .blur(10)
        .png()
        .toBuffer(() => {});

    request.pipe(sharp);
    sharp.pipe(response);
};
