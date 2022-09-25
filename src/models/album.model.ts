import { Schema, model } from "mongoose";
import { AlbumContent, AlbumDocument } from "../utils/types/album.types";

const AlbumContent = new Schema<AlbumContent>({
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

const AlbumSchema = new Schema<AlbumDocument>({
	user: {
		type: Schema.Types.ObjectId,
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

const Album = model("Album", AlbumSchema);

export default Album;
