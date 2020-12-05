import { NextApiRequest, NextApiResponse } from "next";
import { withSession } from "next-session";
import {check} from "../../../lib/service/csrf";
import {options} from "../../../lib/service/session";
import {AdminAPI, validateHydraResponse} from "../../../lib/service/hydra";

export class UserCreateRequest {
    platform: string;
    platformId: string;
    username: string;
    avatar: string;
}

/*


const client = createClient({
    maxAsyncS3: 1,     // this is the default
    s3RetryCount: 3,    // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 1024 * 1024 * 8, // this is the default (20 MB)
    multipartUploadSize: 1024 * 1024 * 8, // this is the default (15 MB)
    s3Options: {
        accessKeyId: process.env.S3,
        secretAccessKey: "your s3 secret",
        endpoint: 's3.yourdomain.com',
        // sslEnabled: false
        // any other options are passed to new AWS.S3()
        // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
    },
});

*/

/*
 * Get the list of enabled features.
 */
async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {
        session: { csrfKey, register },
        body: { validate, _csrf },
    } = req;

    // Validate the csrf token and the request.
    if (_csrf && validate && csrfKey && check(csrfKey, _csrf) && register) {
        // If the user accepted.
        if (validate === "accept") {
            // TODO: Push avatar to s3

            const resp = await fetch(`${process.env.ELLIE_ENDPOINT}/avatar-link?link=${encodeURIComponent(register.user.avatarURL)}`);

            if (resp.ok) {
                const { link } = await resp.json();
                const creationData: UserCreateRequest = {
                    avatar: link,
                    platform: register.user.provider,
                    platformId: register.user.id,
                    username: register.user.username,
                };

                const result = await fetch(`${process.env.SCARLET_ENDPOINT}/api/users/create`, {
                    body: JSON.stringify(creationData),
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (result.ok) {
                    // If the user was created, we login the user within hydra.
                    const user = await result.json();
                    const data = await AdminAPI.acceptLoginRequest(register.loginChallenge, {
                        subject: user.uuid,
                        acr: register.user.provider,
                        remember: true,
                        remember_for: Number(3600),
                    }).then(validateHydraResponse);
                    res.redirect(data.redirect_to);
                    return;
                }
            }
            throw new Error("Failed to create the user.");
        }
        throw new Error("Invalid action.");
    }
    throw new Error("Invalid csrf of request.");
}

export default withSession(handler, options);
