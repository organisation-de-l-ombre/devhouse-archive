/*
 * The S3 client for the takeouts.
 * All the credentials are available variables across all
 * the gitlab projects, so you don't have to worry about
 * the login & credentials.
 */
import S3 from "aws-sdk/clients/s3";

/**
 * @description Globally available S3 client dedicated to the takeouts.
 * His role is to send the dedicated takeout s3 bucket.
 */
export const S3_CLIENT = new S3({
  credentials: {
    accessKeyId: process.env.TAKEOUT_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.TAKEOUT_AWS_SECRET_ACCESS_KEY as string
  },
  endpoint: process.env.TAKEOUT_BUCKET_HOST,
  s3ForcePathStyle: true
});
