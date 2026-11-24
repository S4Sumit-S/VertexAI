import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();

const port = process.env.PORT || 8001;

const app = express();
app.use(express.json());

app.use("/", authRouter);

app.get("/", (req, res) => {
	res.json({
		message: "Hello from auth service",
	});
});

app.listen(port, () => {
	connectDB();
	console.log(`Auth service running at ${port}`);
});
