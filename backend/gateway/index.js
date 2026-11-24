import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { protect } from "./middleware/protect.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import { proxyWithHeader } from "./utils/proxyWithHeaders.js";

dotenv.config();

console.log("PORT:", process.env.PORT);
console.log("AUTH_SERVICE:", process.env.AUTH_SERVICE);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const port = process.env.PORT || 8000;

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/project", protect, proxyWithHeader(process.env.PROJECT_SERVICE));
app.get("/api/me", protect, getCurrentUser);

app.get("/", (req, res) => {
	res.json({
		message: "Gateway open",
	});
});

app.listen(port, () => {
	console.log(`Gateway open at ${port}`);
});
