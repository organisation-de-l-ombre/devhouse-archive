"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var fastify_cors_1 = __importDefault(require("fastify-cors"));
var logger_1 = require("./lib/logger");
var healz_1 = __importDefault(require("./routes/main/healz"));
var FastifyClient = fastify_1.default();
void FastifyClient.register(fastify_cors_1.default);
FastifyClient.setNotFoundHandler(function (request, reply) {
    void reply.code(404).send();
});
FastifyClient.get("/_healz", healz_1.default);
FastifyClient.listen("9000", function (error, address) {
    if (error) {
        throw error;
    }
    logger_1.logger.info("Amelia started on " + address + "!");
});
