import { Request } from "express";
import NotFound from "../errors/notFound";
import { ARTISTS } from "../utils/constants";
import { getArtistAlbums } from "../utils/functions";
import { AlbumReturnType } from "../utils/interface";

export const userAlbumService = async (req: Request, random_number: number) => {
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
