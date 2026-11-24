import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import projectRouter from "./routes/project.routes.js";
dotenv.config();

const port = process.env.PORT || 8002;

const app = express();
app.use(express.json());

app.use("/", projectRouter);

app.get("/", (req, res) => {
	res.json({
		message: "Hello from project service",
	});
});

app.listen(port, () => {
	connectDB();
	console.log(`Project service running at ${port}`);
});
