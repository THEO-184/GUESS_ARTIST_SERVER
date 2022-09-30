import { RequestHandler } from "express";
import { ARTISTS } from "../utils/constants";

export const attacheRandomNumber: RequestHandler = async (req, res, next) => {
	const randomNumber = Math.floor(Math.random() * ARTISTS.length);
	req.user.random_number = randomNumber;

	next();
};
