"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthAPI = exports.UserAPI = exports.LoginAPI = exports.Admin = void 0;
var hydra_client_1 = require("@ory/hydra-client");
var scarlet_1 = require("@developers-house/scarlet");
exports.Admin = new hydra_client_1.AdminApi({
    isJsonMime: function (mime) {
        return mime === "application/json";
    },
    baseOptions: {
        headers: { "X-Forwarded-Proto": "https" }
    }
}, "http://hydra-admin.hydra:4445");
var scarlet = "http://review-v2-openapi-2nrasx.scarlet-22198115-review-v2-openapi-2nrasx";
exports.LoginAPI = new scarlet_1.LoginApi(undefined, scarlet);
exports.UserAPI = new scarlet_1.UserApi(undefined, scarlet);
exports.WebAuthAPI = new scarlet_1.WebauthApi(undefined, scarlet);
