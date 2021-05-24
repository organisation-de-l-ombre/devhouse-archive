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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginCallback = void 0;
var providers_1 = require("../../providers");
var apis_1 = require("../../utils/apis");
var scarlet_1 = require("@developers-house/scarlet");
exports.loginCallback = {
    schema: {
        querystring: {
            required: ["code", "state"],
            properties: {
                code: { type: "string" },
                state: { type: "string" }
            }
        },
        response: {}
    },
    url: "/dialog/api/callback/:provider",
    method: "GET",
    handler: function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var login, _a, code, state, provider, instance, token, user, data, _b, redirect;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        login = request.session.login;
                        _a = request.query, code = _a.code, state = _a.state;
                        provider = request.params.provider;
                        if (!login) {
                            return [2 /*return*/, response.redirect("/dialog/error?error_message=" +
                                    encodeURIComponent("Invalid session."))];
                        }
                        if (login.state !== state) {
                            return [2 /*return*/, response.redirect("/dialog/error?error_message=" +
                                    encodeURIComponent("Failed to validate state."))];
                        }
                        instance = providers_1.Providers.get(provider.toLowerCase());
                        if (!instance) {
                            return [2 /*return*/, response.redirect("/dialog/error?error_message=" +
                                    encodeURIComponent("Invalid loginn provider specified."))];
                        }
                        delete request.session.login;
                        return [4 /*yield*/, instance.exchangeCode(code, "https://" + request.headers.host)];
                    case 1:
                        token = _c.sent();
                        return [4 /*yield*/, instance.getUserData(token)];
                    case 2:
                        user = _c.sent();
                        return [4 /*yield*/, apis_1.LoginAPI.doLogin({
                                with_platform: {
                                    platform_id: user.id,
                                    platform_name: provider
                                }
                            })];
                    case 3:
                        data = (_c.sent()).data;
                        _b = data.status;
                        switch (_b) {
                            case scarlet_1.InlineResponse200StatusEnum.Failed: return [3 /*break*/, 4];
                            case scarlet_1.InlineResponse200StatusEnum.UnknownUser: return [3 /*break*/, 5];
                            case scarlet_1.InlineResponse200StatusEnum.TwoFactorRequired: return [3 /*break*/, 6];
                            case scarlet_1.InlineResponse200StatusEnum.UnknownUser: return [3 /*break*/, 7];
                            case scarlet_1.InlineResponse200StatusEnum.Success: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 12];
                    case 4: // Banned account
                    return [2 /*return*/, response.redirect("/dialog/error?error_message=" +
                            encodeURIComponent("Couldn't access this account."))];
                    case 5: // Bad request
                    return [2 /*return*/, response.redirect("/dialog/error?error_message=" +
                            encodeURIComponent("internal: Scarlet returned unknown user."))];
                    case 6:
                        if (data.user) {
                            request.session.twoFa = {
                                user: data.user,
                                challenge: login.challenge,
                                login: { platform_id: user.id, platform_name: provider },
                            };
                            return [2 /*return*/, response.redirect("/dialog/2fa")];
                        }
                        else {
                            return [2 /*return*/, response.redirect("/dialog/error?error_message=" +
                                    encodeURIComponent("internal: Scarlet returned invalid response for 2fa user."))];
                        }
                        return [3 /*break*/, 12];
                    case 7:
                        request.session.register = {
                            user: user,
                            challenge: login.challenge
                        };
                        delete request.session.login;
                        return [2 /*return*/, response.redirect("/dialog/register?username=" +
                                encodeURIComponent(user.username) +
                                "&avatar=" +
                                encodeURIComponent(user.avatarURL))];
                    case 8:
                        if (!data.user) return [3 /*break*/, 10];
                        return [4 /*yield*/, apis_1.Admin.acceptLoginRequest(login.challenge, {
                                subject: data.user.id,
                                context: {
                                    platform: provider
                                },
                                remember: true,
                                remember_for: 3600
                            })];
                    case 9:
                        redirect = (_c.sent()).data;
                        delete request.session.login;
                        void response.redirect(redirect.redirect_to);
                        return [3 /*break*/, 11];
                    case 10: return [2 /*return*/, response.redirect("/dialog/error?error_message=" +
                            encodeURIComponent("internal: Scarlet returned invalid response for 2fa user."))];
                    case 11: return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    }
};
