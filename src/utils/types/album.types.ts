import mongoose from "mongoose";
import { UserDocument } from "./user.types";

export interface AlbumContent {
	artistName: string;
	collectionName: string;
	artworkUrl60: string;
	artworkUrl100: string;
}

export interface AlbumInput {
	user: UserDocument["_id"];
	attemptNumber: number;
	albums: AlbumContent[];
}

export interface AlbumDocument extends AlbumInput, mongoose.Document {}
