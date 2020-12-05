/*
 * Generate a captcha with a given string.
 */

import {Endpoint} from '../router';
import Sharp from 'sharp';

const dimensionsW = (h: number) => h * 3;

const randomIntBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

let index = 0;

export const generateCaptcha: Endpoint = async (request, response) => {

    const url = new URLSearchParams(request.url.split('?')[1]);

    const data = url.get('text');
    if (!data) return;

    const height = parseInt(url.get('size') || '120');

    /*
     * Step one, generate a noise image texture.
     */

    const textureRaw = Buffer.alloc(
        // Height * Width * Channels
        height * dimensionsW(height) * 4,
        0);
    // Memory layout
    // Ony byte per color.
    // |--------|--------|--------|
    // |i + 0   | i + 1  | i + 2  |
    // | Red    | Green  | Blue   |
    // i = lastPixelOffset + 3

    let lastPixelOffset = 0;
    // For each line
    for (let i = 0; i < height; i++) {
        // For each column
        for (let j = 0; j < dimensionsW(height); j++) {
            const valueB = randomIntBetween(0, 255);
            const valueR = randomIntBetween(0, 255);
            const valueG = randomIntBetween(0, 255);

            textureRaw.set([
                valueR,
                valueG,
                valueB,
                255,
            ], lastPixelOffset);
            lastPixelOffset += 4;
        }
    }
    index += 2;

    // The image builder.
    const sharp = Sharp({
        create: {
            height: height,
            width: dimensionsW(height),
            channels: 4,
            background: {
                b: 0,
                r: 0,
                g: 0,
                alpha: 0,
            },
        },
    })
        .composite([
            {
                input: textureRaw,
                raw: {
                    height: height,
                    width: dimensionsW(height),
                    channels: 4,
                },
                top: 0,
                left: 0,
                blend: "over",
            },
        ])
        .png();

    sharp.pipe(response);
};
