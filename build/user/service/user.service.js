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
exports.updateUserService = exports.findUserService = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("../../auth/models/user.model"));
const errors_1 = __importDefault(require("../../errors"));
const findUserService = (res, id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new errors_1.default.NotFound(`no user found with id : ${id}`);
    }
    if ((user === null || user === void 0 ? void 0 : user.round) > 5) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ user, msg: "Game Over!!!" });
    }
    return user;
});
exports.findUserService = findUserService;
const updateUserService = (id, update) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOneAndUpdate({ _id: id }, Object.assign({}, update), { new: true, runValidators: true });
    if (!user) {
        throw new errors_1.default.NotFound(`no album found for user ${user}`);
    }
    return user;
});
exports.updateUserService = updateUserService;
