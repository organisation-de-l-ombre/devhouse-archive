/*
 * The basic response of the api.
 */

type ResponseError<T> = {
    code: 400;
    message: string;
};

type ResponseSuccess<T> = {
    code: 200;
    data: T;
};

type ResponseMeta = {
    runner: string;
    responseTime: string;
    latency: string;
};

type ServerResponse<T> = (ResponseSuccess<T> | ResponseError<T>) & {
    '_meta': ResponseMeta;
};

export type {
    ServerResponse
};
