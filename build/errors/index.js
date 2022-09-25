"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customError_1 = __importDefault(require("./customError"));
const badRequestError_1 = __importDefault(require("./badRequestError"));
const notFound_1 = __importDefault(require("./notFound"));
const unAuhthorized_1 = __importDefault(require("./unAuhthorized"));
const unAuthenticated_1 = __importDefault(require("./unAuthenticated"));
exports.default = {
    CustomError: customError_1.default,
    BadRequest: badRequestError_1.default,
    NotFound: notFound_1.default,
    UnAuthenticated: unAuthenticated_1.default,
    Unauthorized: unAuhthorized_1.default,
};
