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
const errors_1 = __importDefault(require("../../errors/"));
const constants_1 = require("../../utils/constants");
const user_model_1 = __importDefault(require("../../auth/models/user.model"));
const album_service_1 = require("../service/album.service");
const user_service_1 = require("../service/user.service");
const createUserAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const randomNumber = req.user.random_number;
    const albumData = yield (0, album_service_1.getArtistsAlbumsService)(req, randomNumber);
    const { albums, attemptNumber } = yield (0, album_service_1.createUserAlbumService)(req.user._id, albumData);
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ user: req.user, albums: albums.albums[attemptNumber] });
});
exports.createUserAlbum = createUserAlbum;
const getUserAlbum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, user_service_1.findUserService)(res, req.user._id);
    const albums = yield (0, album_service_1.getUserAlbumServices)(req.user._id);
    const attemptNumber = albums.attemptNumber;
    if (attemptNumber > 3) {
        throw new errors_1.default.NotFound("number of attempts exhausted");
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
    const { attemptNumber } = req.body;
    if (!attemptNumber) {
        throw new errors_1.default.NotFound("provide number of attempt");
    }
    if (attemptNumber > 3) {
        throw new errors_1.default.NotFound("number of attempts cannot exceed 3");
    }
    yield (0, album_service_1.updateUserAlbumService)(req.user._id, { attemptNumber });
    // naviagte to getUserAlbum
    next();
});
exports.nextAttempt = nextAttempt;
// NEXT ROUND
const nextRound = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { scores, round } = req.body;
    if (typeof scores === "undefined" || !round) {
        throw new errors_1.default.BadRequest("provide scores and round");
    }
    const randomNumber = Math.floor(Math.random() * constants_1.ARTISTS.length);
    const user = yield (0, user_service_1.updateUserService)(req.user._id, {
        random_number: randomNumber,
        scores,
        round,
    });
    if (!user) {
        throw new errors_1.default.NotFound(`no album found for user ${req.user._id}`);
    }
    // req.user.random_number = randomNumber;
    next();
});
exports.nextRound = nextRound;
const updateUserAlbumDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield (0, user_service_1.findUserService)(res, req.user._id));
    const albumData = yield (0, album_service_1.getArtistsAlbumsService)(req, user.random_number);
    let userAlbum = yield (0, album_service_1.updateUserAlbumService)(req.user._id, {
        albums: albumData,
        attemptNumber: 1,
    });
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
    yield (0, user_service_1.updateUserService)(req.user._id, { scores: 0, round: 1 });
    const userAlbum = yield (0, album_service_1.updateUserAlbumService)(req.user._id, {
        attemptNumber: 1,
    });
    const attemptNumber = userAlbum.attemptNumber;
    res.status(http_status_codes_1.StatusCodes.OK).json({
        user: userAlbum.user,
        attemptNumber,
        albums: userAlbum.albums[attemptNumber - 1],
    });
});
exports.restartGame = restartGame;
