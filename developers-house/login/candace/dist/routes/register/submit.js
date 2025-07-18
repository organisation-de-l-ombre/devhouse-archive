"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSubmit = void 0;
var apis_1 = require("../../utils/apis");
var node_fetch_1 = __importDefault(require("node-fetch"));
var error_1 = require("../../utils/error");
exports.registerSubmit = {
    schema: {
        body: {
            required: ["term", "private", "name"],
            type: "object",
            properties: {
                term: { type: "boolean" },
                private: { type: "boolean" },
                name: { type: "string" }
            }
        },
        response: {}
    },
    url: "/dialog/api/register",
    method: "POST",
    handler: function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var register, user, resp, link, data, redirect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        register = request.session.register;
                        user = request.body;
                        if (!register) {
                            throw new error_1.CandaceError("400", "MISSING_SESSION_REGISTER", "No register session was specified.");
                        }
                        if (!(user.term && user.name.length > 3 && user.name.length < 33)) return [3 /*break*/, 7];
                        return [4 /*yield*/, new Promise(function (resolve) { return request.destroySession(resolve); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, node_fetch_1.default(process.env.ELLIE_ENDPOINT + "/avatar-link?link=" + encodeURIComponent(register.user.avatarURL))];
                    case 2:
                        resp = _a.sent();
                        if (!resp.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, resp.json()];
                    case 3:
                        link = (_a.sent()).link;
                        return [4 /*yield*/, apis_1.UserAPI.createUser({
                                platform: register.user.provider,
                                platform_id: register.user.id,
                                pub: user.private,
                                username: user.name,
                                avatar: link
                            })];
                    case 4:
                        data = (_a.sent()).data;
                        return [4 /*yield*/, apis_1.Admin.acceptLoginRequest(register.challenge, {
                                subject: data.id,
                                context: {
                                    platform: register.user.provider
                                },
                                remember: true,
                                remember_for: 3600
                            })];
                    case 5:
                        redirect = (_a.sent()).data;
                        return [2 /*return*/, response.send({ redirect: redirect.redirect_to })];
                    case 6: throw new error_1.CandaceError("500", "ELLIE_FAIL", "Ellie failed to process the user profile picture.");
                    case 7: throw new error_1.CandaceError("400", "INVALID_USER", "Invalid user creation detected.");
                }
            });
        });
    }
};
