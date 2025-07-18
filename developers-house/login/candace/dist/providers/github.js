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
var form_data_1 = __importDefault(require("form-data"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var GitHubProvider = /** @class */ (function () {
    function GitHubProvider(properties) {
        this.properties = properties;
    }
    GitHubProvider.prototype.exchangeCode = function (code, host) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, resp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new form_data_1.default();
                        formData.append("client_id", this.properties.client_id);
                        formData.append("client_secret", this.properties.client_secret);
                        formData.append("grant_type", "authorization_code");
                        formData.append("code", code);
                        formData.append("redirect_uri", "" + host + this.properties.redirect_uri + "/github");
                        formData.append("scope", "identify");
                        return [4 /*yield*/, node_fetch_1.default("https://github.com/login/oauth/access_token", {
                                body: formData,
                                method: "POST",
                                headers: {
                                    Accept: "application/json"
                                }
                            })];
                    case 1:
                        resp = _a.sent();
                        if (!resp.ok) {
                            throw new Error("Unable to exchange the token from github.");
                        }
                        return [4 /*yield*/, resp.json()];
                    case 2: 
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return [2 /*return*/, (_a.sent()).access_token];
                }
            });
        });
    };
    GitHubProvider.prototype.getRedirectUri = function (state, host) {
        return "https://github.com/login/oauth/authorize?client_id=" + this.properties.client_id + "&scope=read_user&redirect_uri=" + encodeURIComponent("" + host + this.properties.redirect_uri + "/github") + "&state=" + encodeURIComponent(state) + "&response_type=code&prompt=none";
    };
    GitHubProvider.prototype.getUserData = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var resp, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, node_fetch_1.default("https://api.github.com/user", {
                            headers: {
                                Authorization: "token " + token
                            }
                        })];
                    case 1:
                        resp = _a.sent();
                        return [4 /*yield*/, resp.json()];
                    case 2:
                        user = _a.sent();
                        if (!resp.ok || !user.id || !user.login) {
                            throw new Error("Unable to get the user from github.");
                        }
                        return [2 /*return*/, {
                                id: user.id,
                                username: user.login.toString(),
                                provider: "github",
                                avatarURL: user.avatar_url
                            }];
                }
            });
        });
    };
    GitHubProvider.prototype.meta = function () {
        return { color: "#222222", name: "GitHub" };
    };
    return GitHubProvider;
}());
exports.default = GitHubProvider;
