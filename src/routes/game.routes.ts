import { Router } from "express";
import {
	getUserAlbum,
	getUsersScores,
	nextAttempt,
	nextRound,
	restartGame,
	updateUserAlbumDetails,
} from "../user/controllers/album.controller";
import { authMiddleware } from "../middlewares/auth-middleware";
import { attacheRandomNumber } from "../middlewares/attachRandomNumber";

const router = Router();

router
	.route("/attempts")
	.get(authMiddleware, getUserAlbum)
	.put(authMiddleware, nextAttempt, getUserAlbum);

router
	.route("/rounds")
	.put(authMiddleware, nextRound, attacheRandomNumber, updateUserAlbumDetails);

router.route("/restart").put(authMiddleware, restartGame);

router.route("/users/scores").get(getUsersScores);

export default router;
