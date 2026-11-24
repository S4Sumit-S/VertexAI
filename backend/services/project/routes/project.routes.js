import express from "express";
import {
	createProject,
	deleteProject,
	getProjectById,
	getProjects,
	getStarredProjects,
	toggleStarred,
} from "../controllers/project.controller.js";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.get("/", getProjects);
projectRouter.get("/starred", getStarredProjects);
projectRouter.get("/:id", getProjectById);
projectRouter.patch("/:id", toggleStarred);
projectRouter.delete("/:id", deleteProject);

export default projectRouter;
