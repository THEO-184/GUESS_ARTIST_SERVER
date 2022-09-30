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
exports.updateUserAlbumService = exports.getUserAlbumServices = exports.getArtistsAlbumsService = exports.createUserAlbumService = void 0;
const errors_1 = __importDefault(require("../../errors"));
const notFound_1 = __importDefault(require("../../errors/notFound"));
const constants_1 = require("../../utils/constants");
const functions_1 = require("../../utils/functions");
const album_model_1 = __importDefault(require("../models/album.model"));
const createUserAlbumService = (user, albumData) => __awaiter(void 0, void 0, void 0, function* () {
    const albums = yield album_model_1.default.create({ user, albums: albumData });
    const attemptNumber = albums.attemptNumber;
    return { albums, attemptNumber };
});
exports.createUserAlbumService = createUserAlbumService;
const getArtistsAlbumsService = (req, random_number) => __awaiter(void 0, void 0, void 0, function* () {
    const randomArtist = constants_1.ARTISTS[random_number];
    const response = yield (0, functions_1.getArtistAlbums)(randomArtist);
    if (!response) {
        throw new notFound_1.default(`no artist found with name ${randomArtist}`);
    }
    const { results } = response;
    const albumData = [];
    for (let album of results) {
        const { artworkUrl100, artworkUrl60, collectionName } = album;
        albumData.push({
            artistName: randomArtist,
            artworkUrl100,
            artworkUrl60,
            collectionName,
        });
    }
    return albumData;
});
exports.getArtistsAlbumsService = getArtistsAlbumsService;
const getUserAlbumServices = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const albums = yield album_model_1.default.findOne({ user }).populate("user", "username scores round");
    if (!albums) {
        throw new errors_1.default.NotFound("no album found for this user");
    }
    return albums;
});
exports.getUserAlbumServices = getUserAlbumServices;
const updateUserAlbumService = (user, update) => __awaiter(void 0, void 0, void 0, function* () {
    const album = yield album_model_1.default.findOneAndUpdate({
        user,
    }, Object.assign({}, update), {
        new: true,
        runValidators: true,
    }).populate("user", "username scores round");
    if (!album) {
        throw new errors_1.default.NotFound(`no album found for this user`);
    }
    return album;
});
exports.updateUserAlbumService = updateUserAlbumService;
