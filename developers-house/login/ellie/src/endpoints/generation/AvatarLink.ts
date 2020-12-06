/*
 * Downloads, resize and upload and image while removing all the exif data.
 */

import {PutObjectRequest} from 'aws-sdk/clients/s3';
import {createHash} from 'crypto';
import fetch from 'node-fetch';
import sharp from "sharp";
import {Endpoint} from "../router";
import {Bucket, S3client} from "../S3";

export const avatarLink: Endpoint = async (request, response) => {
    const link = new URLSearchParams((request.url as string).split('?').splice(1).join('?'));
    if (link.has('link')) {
        const image = await fetch(link.get('link') as string);
        if (!link.has('noUpload')) {
            sharp(await image.buffer())
                .resize(250, 250)
                .png({
                    quality: 80,
                })
                .toBuffer((err, buffer) => {
                    if (err) console.log(err);
                    const name = createHash('md5').update(buffer).digest('hex');
                    const param: PutObjectRequest = {
                        Bucket: Bucket as string,
                        Key: 'avatars/' + name + '.png',
                        Body: buffer,
                        ACL: 'public-read',
                        ContentType: 'image/png',
                        ContentLength: buffer.length,
                    };
                    S3client.upload(param, (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        response.write(JSON.stringify({
                            link: result.Bucket + '/' + result.Key,
                            etag: result.ETag,
                        }));
                        response.end();
                    });
                });
        } else {
            const d = sharp()
                .resize(250, 250)
                .toBuffer(() => {
                });
            d.pipe(response);
            image.body.pipe(d);
        }
    }
};
