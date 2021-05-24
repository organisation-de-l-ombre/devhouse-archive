import { FastifyError } from "fastify";

export class CandaceError implements FastifyError {
    constructor(public code: string, public name: string, public message: string) { }
}