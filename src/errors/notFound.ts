import { StatusCodes } from "http-status-codes";
import CustomError from "./customError";

class NotFound extends CustomError {
	statusCode: number;
	constructor(message: string) {
		super(message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

export default NotFound;
