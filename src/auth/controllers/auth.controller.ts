import { createJWT } from "../../utils/jwt";
import { StatusCodes } from "http-status-codes";
import { RequestHandler } from "express";
import User from "../models/user.model";
import { UserInput } from "../../utils/types/user.types";
import BadRequest from "../../errors/badRequestError";
import NotFound from "../../errors/notFound";
import UnAuthenticated from "../../errors/unAuthenticated";

export const registerUser: RequestHandler<{}, {}, UserInput> = async (
	req,
	res,
	next
) => {
	const { password, username } = req.body;
	if (!password || !username) {
		throw new BadRequest("provide username and password");
	}
	const random_number = Math.floor(Math.random() * 20);
	req.body.random_number = random_number;
	const user = await User.create(req.body);

	req.user = user;

	next();
};

export const loginHandler: RequestHandler<{}, {}, UserInput> = async (
	req,
	res
) => {
	const { username, password } = req.body;

	if (!username || !password) {
		throw new BadRequest("provide username and password");
	}

	const user = await User.findOne({ username });
	if (!user) {
		throw new UnAuthenticated("user not authenticated");
	}
	const isPasswordMatch = await user.comparePassword(password);
	if (!isPasswordMatch) {
		throw new UnAuthenticated("user not authenticated");
	}
	const { random_number, round, scores, _id } = user;
	const token = createJWT({ random_number, round, scores, username, _id });
	res.status(StatusCodes.OK).json({
		user: {
			random_number,
			round,
			scores,
			_id: user._id,
			username: user.username,
		},
		token,
	});
};
