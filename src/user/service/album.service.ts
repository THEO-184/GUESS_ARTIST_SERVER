import { UserDocument } from "./../../utils/types/user.types";
import { UpdateQuery } from "mongoose";
import { Request } from "express";
import errors from "../../errors";
import NotFound from "../../errors/notFound";
import { ARTISTS } from "../../utils/constants";
import { getArtistAlbums } from "../../utils/functions";
import { AlbumReturnType } from "../../utils/interface";
import Album from "../models/album.model";

export const createUserAlbumService = async (
	user: UserDocument["_id"],
	albumData: AlbumReturnType["results"]
) => {
	const albums = await Album.create({ user, albums: albumData });
	const attemptNumber = albums.attemptNumber;

	return { albums, attemptNumber };
};

export const getArtistsAlbumsService = async (
	req: Request,
	random_number: number
) => {
	const randomArtist = ARTISTS[random_number];
	const response = await getArtistAlbums(randomArtist);
	if (!response) {
		throw new NotFound(`no artist found with name ${randomArtist}`);
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
};

export const getUserAlbumServices = async (user: UserDocument["_id"]) => {
	const albums = await Album.findOne({ user }).populate(
		"user",
		"username scores round"
	);

	if (!albums) {
		throw new errors.NotFound("no album found for this user");
	}
	return albums;
};

export const updateUserAlbumService = async (
	user: UserDocument["_id"],
	update: UpdateQuery<UserDocument>
) => {
	const album = await Album.findOneAndUpdate(
		{
			user,
		},
		{ ...update },
		{
			new: true,
			runValidators: true,
		}
	).populate("user", "username scores round");
	if (!album) {
		throw new errors.NotFound(`no album found for this user`);
	}

	return album;
};
