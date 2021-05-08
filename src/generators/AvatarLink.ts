import {PutObjectRequest} from 'aws-sdk/clients/s3';
import {createHash} from 'crypto';
import fetch from 'node-fetch';
import sharp from "sharp";
import {Bucket, S3client} from "../S3";
import {RouteOptions} from "fastify";

export const avatarLink: RouteOptions = {
    method: "GET",
    url: "/avatar-link",
    schema: {
        querystring: {
            required: ["link"],
            properties: {
                link: { type: "string" },
            }
        }
    },
    async handler(req, res) {
        const { link } = req.query as { link: string };
        const response = await fetch(link);
        if (response.ok) {
            const buffer = await response.buffer();
            const newImage = await sharp(buffer)
                .resize(500, 500)
                .png({ quality: 80 })
                .toBuffer();
            const name = createHash("md5").update(newImage).digest("hex");
            const param: PutObjectRequest = {
                Bucket: Bucket as string,
                Key: 'avatars/' + name + '.png',
                Body: newImage,
                ACL: 'public-read',
                ContentType: 'image/png',
                ContentLength: newImage.length,
            };
            S3client.upload(param, (err, result) => {
                if (err) {
                    console.log(err);
                }
                res.send({
                    link: result.Bucket + '/' + result.Key,
                    etag: result.ETag,
                });
            });
        }
    }
};
