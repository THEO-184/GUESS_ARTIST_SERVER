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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        minlength: [3, "name must be atleast characters"],
        unique: true,
    },
    random_number: {
        type: Number,
        required: [true, "please provide random number"],
    },
    scores: {
        type: Number,
        required: [true, "please provide user scores"],
        default: 0,
    },
    round: {
        type: Number,
        required: [true, "please provide random number"],
        default: 1,
    },
    password: {
        type: String,
        required: true,
        minlength: [4, "password must be atleast 4 characters"],
    },
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        if (!user.isModified("password"))
            return next();
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(this.password, salt);
        this.password = hash;
        return next();
    });
});
UserSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcryptjs_1.default.compare(password, this.password);
        return isMatch;
    });
};
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
