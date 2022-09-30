import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import errors from "../../errors/";
import { ARTISTS } from "../../utils/constants";
import User from "../../auth/models/user.model";
import {
	createUserAlbumService,
	getArtistsAlbumsService,
	getUserAlbumServices,
	updateUserAlbumService,
} from "../service/album.service";
import { findUserService, updateUserService } from "../service/user.service";
import { UserDocument } from "../../utils/types/user.types";

export const createUserAlbum: RequestHandler = async (req, res) => {
	const randomNumber = req.user.random_number;
	const albumData = await getArtistsAlbumsService(req, randomNumber);
	const { albums, attemptNumber } = await createUserAlbumService(
		req.user._id,
		albumData
	);
	res
		.status(StatusCodes.CREATED)
		.json({ user: req.user, albums: albums.albums[attemptNumber] });
};

export const getUserAlbum: RequestHandler = async (req, res) => {
	await findUserService(res, req.user._id);

	const albums = await getUserAlbumServices(req.user._id);

	const attemptNumber = albums.attemptNumber;
	if (attemptNumber > 3) {
		throw new errors.NotFound("number of attempts exhausted");
	}

	res.status(StatusCodes.OK).json({
		user: albums.user,
		attemptNumber,
		albums: albums.albums[attemptNumber - 1],
	});
};

// NEXT ATTEMPT
export const nextAttempt: RequestHandler<
	{},
	{},
	{ attemptNumber: number }
> = async (req, res, next) => {
	const { attemptNumber } = req.body;
	if (!attemptNumber) {
		throw new errors.NotFound("provide number of attempt");
	}
	if (attemptNumber > 3) {
		throw new errors.NotFound("number of attempts cannot exceed 3");
	}

	await updateUserAlbumService(req.user._id, { attemptNumber });

	// naviagte to getUserAlbum
	next();
};

// NEXT ROUND

export const nextRound: RequestHandler<
	{},
	{},
	{ attemptNumber: number; scores: number; round: number }
> = async (req, res, next) => {
	const { scores, round } = req.body;

	if (typeof scores === "undefined" || !round) {
		throw new errors.BadRequest("provide scores and round");
	}

	const randomNumber = Math.floor(Math.random() * ARTISTS.length);
	const user = await updateUserService(req.user._id, {
		random_number: randomNumber,
		scores,
		round,
	});
	if (!user) {
		throw new errors.NotFound(`no album found for user ${req.user._id}`);
	}
	// req.user.random_number = randomNumber;

	next();
};

export const updateUserAlbumDetails: RequestHandler<{}, {}> = async (
	req,
	res
) => {
	const user = (await findUserService(res, req.user._id)) as UserDocument;
	const albumData = await getArtistsAlbumsService(req, user.random_number);
	let userAlbum = await updateUserAlbumService(req.user._id, {
		albums: albumData,
		attemptNumber: 1,
	});

	const attemptNumber = userAlbum.attemptNumber;

	res.status(StatusCodes.OK).json({
		user: userAlbum.user,
		attemptNumber,
		albums: userAlbum.albums[attemptNumber - 1],
	});
};

export const getUsersScores: RequestHandler = async (req, res) => {
	const scores = await User.find({ round: { $gte: 5 } })
		.select("username scores updatedAt")
		.sort("scores updatedAt");

	res.status(StatusCodes.OK).json({ count: scores.length, scores });
};

export const restartGame: RequestHandler = async (req, res) => {
	await updateUserService(req.user._id, { scores: 0, round: 1 });

	const userAlbum = await updateUserAlbumService(req.user._id, {
		attemptNumber: 1,
	});

	const attemptNumber = userAlbum.attemptNumber;
	res.status(StatusCodes.OK).json({
		user: userAlbum.user,
		attemptNumber,
		albums: userAlbum.albums[attemptNumber - 1],
	});
};
