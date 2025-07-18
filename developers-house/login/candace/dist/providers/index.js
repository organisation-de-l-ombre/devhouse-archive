"use strict";
/*
 * The list of oauth proviers.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Providers = void 0;
var discord_1 = __importDefault(require("./discord"));
var github_1 = __importDefault(require("./github"));
var google_1 = __importDefault(require("./google"));
exports.Providers = new Map();
// eslint-disable-next-line @typescript-eslint/no-shadow
var addProvider = function (name, Provider) {
    if (process.env[name.toUpperCase() + "_SECRET"] &&
        process.env[name.toUpperCase() + "_CLIENT_ID"]) {
        exports.Providers.set(name, new Provider({
            client_id: process.env[name.toUpperCase() + "_CLIENT_ID"],
            redirect_uri: "/dialog/api/callback",
            client_secret: process.env[name.toUpperCase() + "_SECRET"]
        }));
    }
};
addProvider("discord", discord_1.default);
addProvider("google", google_1.default);
addProvider("github", github_1.default);
