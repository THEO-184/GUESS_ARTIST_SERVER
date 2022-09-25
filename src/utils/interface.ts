export interface AlbumReturnType {
	resultCount: Number;
	results: {
		collectionName: string;
		artworkUrl60: string;
		artworkUrl100: string;
		artistName: string;
	}[];
}
