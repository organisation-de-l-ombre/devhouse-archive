import {getManager, getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Link} from "../entity/Link";
import {RequestError} from "../utils/RequestError";
import {validate} from "class-validator";

export class UserController {

    constructor(private readonly userRepository = getRepository(User), private readonly linksRepository = getRepository(Link)) {}

    /*
     * Creates the user from a linked account in the database.
     */
    async create(request: Request, response: Response, next: NextFunction) {
        // Before processing the request, we need to check the body of it.
        const {
            body
        } = request;

        const newLink = new Link();
        const newUser = new User();

        if (body.platform && body.id && body.username && body.avatarHash) {
            // The links verification.
            newLink.platform = body.platform;
            newLink.platformId = body.id;
            // The user building.
            newUser.avatar = body.avatarHash;
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
        next(new RequestError('Invalid data supplied to the request.', 400));
    }

    /*
     * Deletes a user by id from the database.
     */
    async delete(request: Request, res: Response, next: NextFunction) {
        const id = request.params.id;

        if (!id) {
            next(new RequestError('No id specified.', 400))
        }

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
     */
    async edit(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    /*
     * Gets a user from the database.
     */
    async get(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    /*
     * Starts a login session.
     */
    async initiateLogin(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

    /*
     * Pushes data to the login session.
     */
    async pushLogin(request: Request, response: Response, next: NextFunction) {

    }

}