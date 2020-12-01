/*
 * Simple error class.
 */

export class RequestError extends Error {
    constructor(public readonly message: string = 'Unknown error.', public readonly code: number) {
        super(message);
        this.name = 'RequestError';
    }
}