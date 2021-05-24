"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastify_1 = __importDefault(require("fastify"));
var start_1 = require("./routes/consent/start");
var fastify_session_1 = __importDefault(require("fastify-session"));
var fastify_cookie_1 = __importDefault(require("fastify-cookie"));
var submit_1 = require("./routes/consent/submit");
var start_2 = require("./routes/login/start");
var callback_1 = require("./routes/login/callback");
var submit_2 = require("./routes/register/submit");
var start_3 = require("./routes/2fa/start");
var submit_3 = require("./routes/2fa/submit");
var server = fastify_1.default({
    logger: true
});
void server.register(fastify_cookie_1.default);
void server.register(fastify_session_1.default, {
    secret: "shfvjkdshvkjsdhvkshvkdsjhvkshvksjdhvkshdkhj",
    cookie: {
        secure: false
    }
});
server.route(start_1.consentStart);
server.route(submit_1.consentSubmit);
server.route(start_2.loginStart);
server.route(callback_1.loginCallback);
server.route(submit_2.registerSubmit);
server.route(start_3.twoFaStart);
server.route(submit_3.twoFaSubmit);
server.setErrorHandler(function (error, _, response) {
    response
        .code(error.statusCode || 500)
        .send({ error: true, message: error.message });
});
server.get("/_healz", function (request, response) {
    void response.code(200).send();
});
void server.listen(5000);
