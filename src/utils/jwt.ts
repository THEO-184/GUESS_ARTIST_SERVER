import Jwt from "jsonwebtoken";
import { UserInput } from "./types/user.types";

export const createJWT = (
	payload: Omit<UserInput, "password"> & { _id: any }
) => {
	const token = Jwt.sign(payload, process.env.JWT_SECRET!);
	return token;
};
