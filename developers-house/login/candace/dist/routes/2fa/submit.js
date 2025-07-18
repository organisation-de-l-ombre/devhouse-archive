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
exports.twoFaSubmit = void 0;
/**
 * Starts a consent session using a consent_challenge.
 */
var scarlet_1 = require("@developers-house/scarlet");
var apis_1 = require("../../utils/apis");
var error_1 = require("../../utils/error");
exports.twoFaSubmit = {
    schema: {
        body: {
            required: ["type"],
            type: "object",
            properties: {
                type: { type: "string" },
                otp: { type: "number" },
            }
        },
        response: {}
    },
    url: "/dialog/api/2fa",
    method: "POST",
    handler: function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var type, twoFa, data, code, responseData, redirect;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = request.body.type;
                        twoFa = request.session.twoFa;
                        if (!twoFa) {
                            throw new error_1.CandaceError('400', "MISSING_2FA_SESSION", "A 2fa session is required to call the 2fa endpoint.");
                        }
                        data = { with_platform: twoFa.login };
                        if (type === "otp") {
                            code = request.body.code;
                            data.with_otp = { code: code };
                        }
                        else if (type === "webauth") {
                            // TODO.
                        }
                        else {
                            throw new error_1.CandaceError("400", "INVALID_2FA_VALIDATION_TYPE", "Invalid 2fa validation provided to the submit endpoint.");
                        }
                        return [4 /*yield*/, apis_1.LoginAPI.doLogin(data)];
                    case 1:
                        responseData = (_a.sent()).data;
                        delete request.session.twoFa;
                        if (!(responseData.status === scarlet_1.InlineResponse200StatusEnum.Success && responseData.user)) return [3 /*break*/, 3];
                        return [4 /*yield*/, apis_1.Admin.acceptLoginRequest(twoFa.challenge, {
                                subject: responseData.user.id,
                                context: {
                                    platform: twoFa.login.platform_name,
                                    two_fa: type,
                                },
                                remember: true,
                                remember_for: 3600
                            })];
                    case 2:
                        redirect = (_a.sent()).data;
                        void response.code(200).send({ redirect: redirect.redirect_to });
                        return [2 /*return*/];
                    case 3: throw new error_1.CandaceError("400", "FAILED_2FA_C_LOGIN", "Failed to login-in using the provided user & credentials.");
                }
            });
        });
    }
};
