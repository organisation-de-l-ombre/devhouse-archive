import S3 from "aws-sdk/clients/s3";

export const S3client = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "Invalid AWS_ACCESS_KEY_ID ",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "AWS_SECRET_ACCESS_KEY",
    },
    endpoint: 'http://' + process.env.BUCKET_HOST + ':' + process.env.BUCKET_PORT,
    s3ForcePathStyle: true,
});

export const Bucket = process.env.BUCKET_NAME;
