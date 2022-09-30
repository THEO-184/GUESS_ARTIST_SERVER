"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AlbumContent = new mongoose_1.Schema({
    artistName: {
        type: String,
        required: [true, "provide album's artist name"],
    },
    collectionName: {
        type: String,
        required: [true, "provide album's artist name"],
    },
    artworkUrl60: {
        type: String,
        required: [true, "provide album's artwork 60"],
    },
    artworkUrl100: {
        type: String,
        required: [true, "provide album's artwork 100"],
    },
});
const AlbumSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "provide user ref"],
        ref: "User",
    },
    attemptNumber: {
        type: Number,
        required: [true, "provide attempt Number"],
        default: 1,
    },
    albums: [AlbumContent],
});
const Album = (0, mongoose_1.model)("Album", AlbumSchema);
exports.default = Album;
