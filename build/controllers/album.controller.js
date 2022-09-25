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
exports.restartGame = exports.getUsersScores = exports.updateUserAlbumDetails = exports.nextRound = exports.nextAttempt = exports.getUserAlbum = exports.createUserAlbum = void 0;
const http_status_codes_1 = require("http-status-codes");
const notFound_1 = __importDefault(require("../errors/notFound"));
const album_model_1 = __importDefault(require("../models/album.model"));
const constants_1 = require("../utils/constants");
const badRequestError_1 = __importDefault(require("../errors/badRequestError"));
const user_model_1 = __importDefault(require("../models/user.model"));
const album_service_1 = require("../service/album.service");
const createUserAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const randomNumber = req.user.random_number;
    const albumData = yield (0, album_service_1.userAlbumService)(req, randomNumber);
    const albums = yield album_model_1.default.create({ user: req.user._id, albums: albumData });
    const attemptNumber = albums.attemptNumber;
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ user: req.user, albums: albums.albums[attemptNumber] });
});
exports.createUserAlbum = createUserAlbum;
const getUserAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const albums = yield album_model_1.default.findOne({ user: req.user._id }).populate("user", "username scores round");
    if (!albums) {
        throw new notFound_1.default("no album found for this user");
    }
    const attemptNumber = albums.attemptNumber;
    if (attemptNumber > 3) {
        throw new badRequestError_1.default("number of attempts exhausted");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: albums.user,
        attemptNumber,
        albums: albums.albums[attemptNumber - 1],
    });
});
exports.getUserAlbum = getUserAlbum;
// NEXT ATTEMPT
const nextAttempt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.attemptNumber) {
        throw new badRequestError_1.default("provide number of attempt");
    }
    if (req.body.attemptNumber > 3) {
        throw new badRequestError_1.default("number of attempts exhausted");
    }
    const album = yield album_model_1.default.findOneAndUpdate({
        user: req.user._id,
    }, { attemptNumber: req.body.attemptNumber }, {
        new: true,
        runValidators: true,
    });
    if (!album) {
        throw new notFound_1.default(`no album found for this user`);
    }
    // naviagte to getUserAlbum
    next();
});
exports.nextAttempt = nextAttempt;
// NEXT ROUND
const nextRound = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { attemptNumber, scores, round } = req.body;
    if (round > 5) {
        return res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Game Over!!!" });
    }
    if (typeof scores === "undefined" || !round) {
        throw new badRequestError_1.default("provide scores and round");
    }
    const randomNumber = Math.floor(Math.random() * constants_1.ARTISTS.length);
    const user = yield user_model_1.default.findOneAndUpdate({ _id: req.user._id }, { random_number: randomNumber, scores, round }, { new: true, runValidators: true });
    if (!user) {
        throw new notFound_1.default(`no album found for user ${req.user._id}`);
    }
    console.log("random number generated", randomNumber);
    req.user.random_number = randomNumber;
    next();
});
exports.nextRound = nextRound;
const updateUserAlbumDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("update user random", req.user.random_number);
    const albumData = yield (0, album_service_1.userAlbumService)(req, req.user.random_number);
    const userAlbum = yield album_model_1.default.findOneAndUpdate({ user: req.user._id }, { albums: albumData, attemptNumber: 1 }, { new: true, runValidators: true }).populate("user", "username scores round");
    if (!userAlbum) {
        throw new notFound_1.default(`no album found for user ${req.user._id}`);
    }
    const attemptNumber = userAlbum.attemptNumber;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: userAlbum.user,
        attemptNumber,
        albums: userAlbum.albums[attemptNumber - 1],
    });
});
exports.updateUserAlbumDetails = updateUserAlbumDetails;
const getUsersScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scores = yield user_model_1.default.find({ round: { $gte: 5 } }).select("username scores updatedAt");
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: scores.length, scores });
});
exports.getUsersScores = getUsersScores;
const restartGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOneAndUpdate({ _id: req.user._id }, { scores: 0, round: 1 }, { new: true, runValidators: true });
    if (!user) {
        throw new notFound_1.default(`no user found with id ${req.user._id}`);
    }
    const userAlbum = yield album_model_1.default.findOneAndUpdate({ user: req.user._id }, { attemptNumber: 1 }).populate("user", "username scores round");
    if (!userAlbum) {
        throw new notFound_1.default(`no album found for user ${req.user._id}`);
    }
    const attemptNumber = userAlbum.attemptNumber;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: userAlbum.user,
        attemptNumber,
        albums: userAlbum.albums[attemptNumber - 1],
    });
});
exports.restartGame = restartGame;
