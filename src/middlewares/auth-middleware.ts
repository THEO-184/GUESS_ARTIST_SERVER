import { RequestHandler } from "express";
import UnAuthenticated from "../errors/unAuthenticated";
import Jwt from "jsonwebtoken";
import { UserDocument } from "../utils/types/user.types";

export const authMiddleware: RequestHandler = async (req, res, next) => {
	const authHeaders = req.headers["authorization"];
	if (!authHeaders || !authHeaders.startsWith("Bearer")) {
		throw new UnAuthenticated("user not authenticated");
	}
	const token = authHeaders.split(" ")[1];

	try {
		const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as UserDocument;
		console.log("decoded", decoded);
		req.user = decoded;
		next();
	} catch (error) {
		throw new UnAuthenticated("user not authenticated");
	}
};
