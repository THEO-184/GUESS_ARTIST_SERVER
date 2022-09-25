import { StatusCodes } from "http-status-codes";
import CustomError from "./customError";

class UnAuthenticated extends CustomError {
	statusCode: number;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

export default UnAuthenticated;
