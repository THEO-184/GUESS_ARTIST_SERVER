import { Router } from "express";
import {
	getUserAlbum,
	getUsersScores,
	nextAttempt,
	nextRound,
	restartGame,
	updateUserAlbumDetails,
} from "../controllers/album.controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();

router
	.route("/attempts")
	.get(authMiddleware, getUserAlbum)
	.put(authMiddleware, nextAttempt, getUserAlbum);

router.route("/rounds").put(authMiddleware, nextRound, updateUserAlbumDetails);

router.route("/restart").put(authMiddleware, restartGame);

router.route("/users/scores").get(getUsersScores);

export default router;
