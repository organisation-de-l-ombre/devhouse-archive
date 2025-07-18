"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandaceError = void 0;
var CandaceError = /** @class */ (function () {
    function CandaceError(code, name, message) {
        this.code = code;
        this.name = name;
        this.message = message;
    }
    return CandaceError;
}());
exports.CandaceError = CandaceError;
