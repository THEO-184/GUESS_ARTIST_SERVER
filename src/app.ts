import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

// local imports
import connectDb from "./db/connect";
import expressErrorMiddleware from "./middlewares/express-middleware";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/game.routes";

const app = express();
// middlewars
app.use(morgan("tiny"));
// app.use(
// 	cors({
// 		credentials: true,
// 		origin: "https://guess-artist-client.onrender.com/",
// 	})
// );

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/game", userRoutes);

app.use(expressErrorMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDb(process.env.MONGO_URI!);
		app.listen(PORT, () => {
			console.log(`server running on ${PORT}`);
		});
	} catch (error) {
		console.log("error", error);
	}
};

start();
