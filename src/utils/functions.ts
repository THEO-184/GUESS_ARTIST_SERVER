import { AlbumReturnType } from "./interface";
import fetch from "node-fetch";

export const getArtistAlbums = async (
	artist: string,
	country = "US",
	media = "music",
	entity = "album",
	limit = 3
): Promise<AlbumReturnType | undefined> => {
	try {
		const res = await fetch(
			`https://itunes.apple.com/search?term=${artist}&country=${country}&media=${media}&entity=${entity}&limit=${limit}`
		);
		const data = (await res.json()) as AlbumReturnType;
		return data;
	} catch (error) {
		console.log(error);
	}
};
