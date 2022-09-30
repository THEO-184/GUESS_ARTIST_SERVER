import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UpdateQuery } from "mongoose";
import User from "../../auth/models/user.model";
import errors from "../../errors";
import { UserDocument } from "../../utils/types/user.types";

export const findUserService = async (
	res: Response,
	id: UserDocument["_id"]
) => {
	const user = await User.findOne({ _id: id });
	if (!user) {
		throw new errors.NotFound(`no user found with id : ${id}`);
	}

	if (user?.round > 5) {
		return res.status(StatusCodes.OK).json({ user, msg: "Game Over!!!" });
	}
	return user;
};

export const updateUserService = async (
	id: UserDocument["_id"],
	update: UpdateQuery<UserDocument>
) => {
	const user = await User.findOneAndUpdate(
		{ _id: id },
		{ ...update },
		{ new: true, runValidators: true }
	);
	if (!user) {
		throw new errors.NotFound(`no album found for user ${user}`);
	}

	return user;
};
