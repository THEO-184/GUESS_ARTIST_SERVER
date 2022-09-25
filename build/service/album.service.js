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
exports.userAlbumService = void 0;
const notFound_1 = __importDefault(require("../errors/notFound"));
const constants_1 = require("../utils/constants");
const functions_1 = require("../utils/functions");
const userAlbumService = (req, random_number) => __awaiter(void 0, void 0, void 0, function* () {
    const randomArtist = constants_1.ARTISTS[random_number];
    const response = yield (0, functions_1.getArtistAlbums)(randomArtist);
    console.log("response", response);
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
exports.userAlbumService = userAlbumService;
