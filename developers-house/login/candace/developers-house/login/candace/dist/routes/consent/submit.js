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
exports.consentSubmit = void 0;
var apis_1 = require("../../utils/apis");
var error_1 = require("../../utils/error");
exports.consentSubmit = {
    schema: {
        body: {
            required: ["granted"],
            type: "object",
            properties: {
                granted: { type: "boolean" }
            }
        },
        response: {}
    },
    url: "/dialog/api/consent",
    method: "POST",
    handler: function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var consent, granted, function_, user, _a, status, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        consent = request.session.consent;
                        granted = request.body.granted;
                        if (!consent) {
                            throw new error_1.CandaceError("400", "MISSING_CONSENT_SESSION", "You need a consent session to interact with this endpoint.");
                        }
                        function_ = (granted
                            ? // eslint-disable-next-line @typescript-eslint/unbound-method
                                apis_1.Admin.acceptConsentRequest
                            : // eslint-disable-next-line @typescript-eslint/unbound-method
                                apis_1.Admin.rejectConsentRequest).bind(apis_1.Admin);
                        return [4 /*yield*/, apis_1.UserAPI.getUser(consent.sub)];
                    case 1:
                        user = (_b.sent()).data;
                        return [4 /*yield*/, function_(consent.challenge, granted
                                ? {
                                    grant_access_token_audience: consent.audiences,
                                    grant_scope: consent.scopes,
                                    remember: true,
                                    remember_for: 0,
                                    session: {
                                        id_token: user,
                                    }
                                }
                                : {})];
                    case 2:
                        _a = _b.sent(), status = _a.status, data = _a.data;
                        if (!(status === 200)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (resolve) { return request.destroySession(resolve); })];
                    case 3:
                        _b.sent();
                        void response.code(200).send({ redirect: data.redirect_to });
                        return [2 /*return*/];
                    case 4: throw new error_1.CandaceError("400", "FAILED_CONSENT_VALIDATION", "Failed to validate the consent validation.");
                }
            });
        });
    }
};
