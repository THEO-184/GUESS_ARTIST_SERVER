import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import NotFound from "../errors/notFound";
import Album from "../models/album.model";
import { ARTISTS } from "../utils/constants";
import { getArtistAlbums } from "../utils/functions";
import BadRequest from "../errors/badRequestError";
import User from "../models/user.model";
import { userAlbumService } from "../service/album.service";

export const createUserAlbum: RequestHandler = async (req, res) => {
	const randomNumber = req.user.random_number;
	const albumData = await userAlbumService(req, randomNumber);

	const albums = await Album.create({ user: req.user._id, albums: albumData });
	const attemptNumber = albums.attemptNumber;

	res
		.status(StatusCodes.CREATED)
		.json({ user: req.user, albums: albums.albums[attemptNumber] });
};

export const getUserAlbum: RequestHandler = async (req, res) => {
	const user = await User.findOne({ _id: req.user._id });
	if (!user) {
		throw new NotFound(`no user found with id : ${req.user._id}`);
	}

	if (user?.round > 5) {
		return res.status(StatusCodes.OK).json({ user, msg: "Game Over!!!" });
	}

	const albums = await Album.findOne({ user: req.user._id }).populate(
		"user",
		"username scores round"
	);
	if (!albums) {
		throw new NotFound("no album found for this user");
	}

	const attemptNumber = albums.attemptNumber;
	if (attemptNumber > 3) {
		throw new BadRequest("number of attempts exhausted");
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
	if (!req.body.attemptNumber) {
		throw new BadRequest("provide number of attempt");
	}
	if (req.body.attemptNumber > 3) {
		throw new BadRequest("number of attempts exhausted");
	}

	const album = await Album.findOneAndUpdate(
		{
			user: req.user._id,
		},
		{ attemptNumber: req.body.attemptNumber },
		{
			new: true,
			runValidators: true,
		}
	);
	if (!album) {
		throw new NotFound(`no album found for this user`);
	}

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
		throw new BadRequest("provide scores and round");
	}

	const randomNumber = Math.floor(Math.random() * ARTISTS.length);
	const user = await User.findOneAndUpdate(
		{ _id: req.user._id },
		{ random_number: randomNumber, scores, round },
		{ new: true, runValidators: true }
	);
	if (!user) {
		throw new NotFound(`no album found for user ${req.user._id}`);
	}
	req.user.random_number = randomNumber;

	next();
};

export const updateUserAlbumDetails: RequestHandler<{}, {}> = async (
	req,
	res
) => {
	const albumData = await userAlbumService(req, req.user.random_number);
	const userAlbum = await Album.findOneAndUpdate(
		{ user: req.user._id },
		{ albums: albumData, attemptNumber: 1 },
		{ new: true, runValidators: true }
	).populate("user", "username scores round");

	if (!userAlbum) {
		throw new NotFound(`no album found for user ${req.user._id}`);
	}
	const attemptNumber = userAlbum.attemptNumber;

	res.status(StatusCodes.OK).json({
		user: userAlbum.user,
		attemptNumber,
		albums: userAlbum.albums[attemptNumber - 1],
	});
};

export const getUsersScores: RequestHandler = async (req, res) => {
	const scores = await User.find({ round: { $gte: 5 } }).select(
		"username scores updatedAt"
	);

	res.status(StatusCodes.OK).json({ count: scores.length, scores });
};

export const restartGame: RequestHandler = async (req, res) => {
	const user = await User.findOneAndUpdate(
		{ _id: req.user._id },
		{ scores: 0, round: 1 },
		{ new: true, runValidators: true }
	);

	if (!user) {
		throw new NotFound(`no user found with id ${req.user._id}`);
	}

	const userAlbum = await Album.findOneAndUpdate(
		{ user: req.user._id },
		{ attemptNumber: 1 }
	).populate("user", "username scores round");

	if (!userAlbum) {
		throw new NotFound(`no album found for user ${req.user._id}`);
	}

	const attemptNumber = userAlbum.attemptNumber;
	res.status(StatusCodes.OK).json({
		user: userAlbum.user,
		attemptNumber,
		albums: userAlbum.albums[attemptNumber - 1],
	});
};
