"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var getDate = function (time) {
    var date = new Date(time);
    var day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
    var year = date.getFullYear();
    var hours = date.getHours() >= 10 ? date.getHours() : "0" + date.getHours();
    var minutes = date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes();
    var seconds = date.getSeconds() >= 10 ? date.getSeconds() : "0" + date.getSeconds();
    return day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
};
var _a = {
    reset: '\u001b[0m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    red: '\u001b[31m'
}, reset = _a.reset, green = _a.green, yellow = _a.yellow, red = _a.red;
exports.logger = new /** @class */ (function () {
    function Logger() {
    }
    /**
     * Logs a message in the console with green color
     */
    Logger.prototype.info = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        console.log(green + "[" + getDate(Date.now()) + "] " + message + reset);
    };
    /**
     * Logs a message in the console with yellow color
     */
    Logger.prototype.warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        console.log(yellow + "[" + getDate(Date.now()) + "] " + message + reset);
    };
    /**
     * Logs a message in the console with red color
     */
    Logger.prototype.error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        console.log(red + "[" + getDate(Date.now()) + "] " + message + reset);
    };
    return Logger;
}())();
