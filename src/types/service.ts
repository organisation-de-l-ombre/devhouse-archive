/*
 * A generic service interface for data management.
 * A service is a component of the program containing user data.
 * As any component with user data should be linked to cryir for data management
 * purposes, this interface represents a service that can be used to talk to Cryir
 * and report data.
 */

import {DeletePayload, Payload, TakeoutPayload} from "./protocol";
import {Stream} from "stream";

type PromiseOfNone<T> = Promise<T> | T;
type ArrayOrSingle<T> = T[] | T;
type WithName<T> = {
    data: T;
    file: string;
};

export type TakeoutRequest = PromiseOfNone<ArrayOrSingle<WithName<Buffer | Stream>>>;

/**
 * @description This interface represents a service that contains user data that must be reported back to Cryir.
 */
export interface IService {

    /**
     * @description Deletes all the data from a user in the databases, this cannot be recovered.
     */
    deleteUserData (payload: DeletePayload): Promise<void> | void;

    /**
     * @description Returns if the service contains data from a specific user.
     */
    hasUserData (payload: Payload): Promise<boolean> | boolean;

    /**
     * @description Gets all the available user data from the services.
     */
    getUserData (payload: TakeoutPayload): TakeoutRequest;

}