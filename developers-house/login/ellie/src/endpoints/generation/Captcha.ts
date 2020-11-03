/*
 * Generate a captcha with a given string.
 */

import {Endpoint} from '../router';
import Sharp from 'sharp';
import Simplex from 'simplex-noise';

const dimensionsW = (h: number) => h * 3;

const randomIntBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const simplex = new Simplex();
let index = 0;

export const generateCaptcha: Endpoint = async (request, response) => {

    const url = new URLSearchParams(request.url.split('?')[1]);

    const data = url.get('text');
    if (!data) return;

    const height = 120;

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
            let invert = simplex.noise3D(i / 25, j / 25, index) * 60;
            let grey2 = simplex.noise3D(i / 25, j / 25, index) *  60;
            let grey3 = simplex.noise3D(i / 25, j / 25, index) *  60;

            if (invert > 0.5) {
                grey2 = 255 - grey2;
            } else {
                grey3 = 255 - grey3;
            }

            textureRaw.set([
                0,
                grey2,
                grey3,
                invert * 3,
            ], lastPixelOffset);
            lastPixelOffset += 4;
        }
    }
    index += 2;


    /*
     * Second text, we generate the text.
     */
    const text = await Sharp(Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${dimensionsW(height)}" height="${height}">
        <text fill="black" rotate="${randomIntBetween(0, 10)}" x="${dimensionsW(height) / 4 + randomIntBetween(-10, 10)}" y="${height / 2 + (height / 1.5) / 2 + randomIntBetween(-10, 10)}" font-size="${height / 1.5 + randomIntBetween(2, 3)}">
            ${data}
        </text>
    </svg>    
    `))
        .resize(dimensionsW(height), height)
        .png()
        .toBuffer();

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
            {
                input: text,
                blend: "overlay",
            }
        ])
        .png();

    sharp.pipe(response);
};
