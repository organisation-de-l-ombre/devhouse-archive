import {getManager, getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Link} from "../entity/Link";
import {RequestError} from "../utils/RequestError";
import {validate} from "class-validator";
import {Redis} from "ioredis";
import {InitiateLoginRequest, UserCreateRequest} from "../spec/types";

export class UserController {

    constructor(private readonly redis: Redis, private readonly userRepository = getRepository(User), private readonly linksRepository = getRepository(Link)) {
    }

    /*
     * Creates the user from a linked account in the database.
     * STATUS: Done
     */
    async create(request: Request<{}, {}, UserCreateRequest>, response: Response, next: NextFunction) {
        // Before processing the request, we need to check the body of it.
        const {
            body
        } = request;

        const newLink = new Link();
        const newUser = new User();

        const validation = await validate(body);

        if (validation.length > 0) {
            next(new RequestError('Invalid body.', 400));
            return;
        }

        // The links verification.
        newLink.platform = body.platform;
        newLink.platformId = body.platformId;
        newUser.avatar = body.avatar;
        newUser.ban = undefined;
        newUser.dataCollection = true;
        newUser.premium = false;
        newUser.roles = 0x0;
        newUser.private = true;
        newUser.twoFactor = undefined;
        newUser.username = body.username;

        // Validate the data.
        const validations = [
            ...await validate(newUser),
            ...await validate(newLink)
        ];

        if (validations.length > 0) {
            next(new RequestError('Invalid data supplied to the request.', 400));
            return;
        }

        const result = await getManager()
            .transaction(async (trs) => {
                // Creates a user.
                newLink.user = await trs.save(newUser);
                // Create a linked account.
                await trs.save(newLink);
                // Return the result of the transaction.
                return newLink.user;
            })
            .catch(() => {
                // Request failed!
                // TODO: Apm todo
            });

        if (result) {
            response.json(result);
            return;
        }
        next(new RequestError('Failed to create the user and the link during the transaction.', 500));
    }

    /*
     * Deletes a user by id from the database.
     * STATUS: Done
     */
    async delete(request: Request<{ id: string }>, res: Response, next: NextFunction) {
        const {id} = request.params;

        const user = await this.userRepository.findOne({
            where: {
                uuid: id,
            },
        });

        if (user) {
            const result = await getManager()
                .transaction(async (tra) => {
                    await tra.remove(user);
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    // Request failed!
                    // TODO: Apm todo
                });
            if (result) {
                res.json({
                    deleted: true,
                });
                return;
            }
            next(new RequestError('Failed to delete the user!', 500));
        }
        next(new RequestError('No such user.', 404));
    }

    /*
     * Patches the user in the database.
     * Status: Todo
     * TODO: Implement the edit endpoint (high priority)
     */
    async edit(request: Request, response: Response, next: NextFunction) {

    }

    /*
     * Gets a user from the database.
     * Status: Done
     */
    async get(request: Request<{ id: string }>, response: Response, next: NextFunction) {
        const {id} = request.params;

        const user = await this.userRepository.findOne({
            where: {
                uuid: id,
            },
        });

        if (!user) {
            next(new RequestError('No such user.', 404));
        }

        response.json(user);
    }

    /*
     * Starts a login session.
     * Status: Doing
     * TODO: Implement the 2FA verification.
     */
    async initiateLogin(request: Request<{}, {}, InitiateLoginRequest>, response: Response, next: NextFunction) {

        const {
            body,
        } = request;

        const validation = await validate(body);

        if (validation.length > 0) {
            next(new RequestError('Invalid body.', 400));
            return;
        }

        const link = await this.linksRepository.findOne({
            where: {
                platform: body.platform,
                platformId: body.platformId,
            },
            relations: ['user'],
        });

        let status;
        let user;

        // If the user does not exists, we set the status to NO_USER
        if (!link) {
            status = 'NO_USER';
        } else {
            // We now the user and we have it.
            user = link.user;
            // Is the user using two factor authentication
            const cTFA = await link.user.twoFactor;

            if (!cTFA) {
                status = 'FLOW_VALIDATED';
            } else {
                if (body.twoFaCode) {
                    // TODO: Verify code.
                    status = '2FA_REQUIRED_RETRY';
                }
            }
        }
        if (!!status) {
            response.json({
                status,
                user,
            });
            return;
        } else {
            next(new RequestError('Invalid.', 400));
        }
    }
}
