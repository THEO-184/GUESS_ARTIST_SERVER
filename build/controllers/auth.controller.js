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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = exports.registerUser = void 0;
const jwt_1 = require("./../utils/jwt");
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("../models/user.model"));
const badRequestError_1 = __importDefault(require("../errors/badRequestError"));
const unAuthenticated_1 = __importDefault(require("../errors/unAuthenticated"));
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, username } = req.body;
    if (!password || !username) {
        throw new badRequestError_1.default("provide username and password");
    }
    const random_number = Math.floor(Math.random() * 20);
    req.body.random_number = random_number;
    const user = yield user_model_1.default.create(req.body);
    req.user = user;
    next();
});
exports.registerUser = registerUser;
const loginHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new badRequestError_1.default("provide username and password");
    }
    const user = yield user_model_1.default.findOne({ username });
    if (!user) {
        throw new unAuthenticated_1.default("user not authenticated");
    }
    const isPasswordMatch = yield user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new unAuthenticated_1.default("user not authenticated");
    }
    const { random_number, round, scores, _id } = user;
    const token = (0, jwt_1.createJWT)({ random_number, round, scores, username, _id });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: {
            random_number,
            round,
            scores,
            _id: user._id,
            username: user.username,
        },
        token,
    });
});
exports.loginHandler = loginHandler;
