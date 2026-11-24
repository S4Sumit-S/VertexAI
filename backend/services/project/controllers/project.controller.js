import redis from "../../../shared/redis/redis.js";
import Project from "../models/project.model.js";

export const createProject = async (req, res) => {
	try {
		const userId = req.headers["x-user-id"];
		if (!userId) {
			return res
				.status(401)
				.json({ message: "userId is required to create a project" });
		}

		const { name, description } = req.body;
		const project = await Project.create({
			owner: userId,
			name,
			description,
		});

		const key = `projects-${userId}`;
		await redis.del(key);

		return res.status(201).json({ message: "Project created", project });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: `Create project error` });
	}
};

export const getProjects = async (req, res) => {
	try {
		const userId = req.headers["x-user-id"];
		if (!userId) {
			return res
				.status(401)
				.json({ message: "userId is required to get projects" });
		}

		const key = `projects-${userId}`;
		let result = await redis.get(key);
		if (result) {
			return res.status(200).json(JSON.parse(result));
		}

		const projects = await Project.find({ owner: userId }).sort({
			updatedAt: -1,
		});

		await redis.set(key, JSON.stringify(projects));

		return res.status(200).json(projects);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: `getProjects error` });
	}
};

export const getProjectById = async (req, res) => {
	try {
		// const userId = req.headers["x-user-id"];
		// if(!userId){
		//   return res.status(401).json({
		//     message:"userId is required to fetch a project by id"
		//   })
		// }

		const { id } = req.params;
		const project = await Project.findById(id);

		if (!project) {
			return res.status(404).json({
				message: "No such project exists",
			});
		}

		project.lastOpenedAt = new Date();
		await project.save();

		return res.status(200).json(project);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: `getProjectById error` });
	}
};

export const getStarredProjects = async (req, res) => {
	try {
		const userId = req.headers["x-user-id"];
		if (!userId) {
			return res.status(401).json({
				message: "userId is required to get starred projects",
			});
		}

		const key = `starred-projects-${userId}`;
		const result = await redis.get(key);
		if (result) {
			return res.status(200).json(JSON.parse(result));
		}

		const projects = await Project.find({ owner: userId, starred: true }).sort({
			updatedAt: -1,
		});

		await redis.set(key, JSON.stringify(projects));

		return res.status(200).json(projects);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: `getStarredProjects error` });
	}
};

export const toggleStarred = async (req, res) => {
	try {
		const userId = req.headers["x-user-id"];
		if (!userId) {
			return res.status(401).json({
				message: "userId is required to toggle a starred project",
			});
		}

		const { id } = req.params;
		// Find the project
		const project = await Project.findById(id);
		if (!project) {
			return res.status(404).json({
				message: "No such project exists",
			});
		}
		// Ensure the user owns this project
		if (!project.owner.equals(userId)) {
			return res.status(403).json({
				message: "Not authorized to update this project",
			});
		}

		// Toggle starred status
		project.starred = !project.starred;
		await project.save();

		await redis.del(`projects-${userId}`, `starred-projects-${userId}`);

		return res.status(200).json({
			message: "Project starred status updated",
			project,
		});
	} catch (error) {
		console.error("Error toggling starred status:", error);
		return res.status(500).json({
			message: "Error toggling starred status",
		});
	}
};

export const deleteProject = async (req, res) => {
	try {
		const userId = req.headers["x-user-id"];
		if (!userId) {
			return res.status(401).json({
				message: "userId is required to delete a project",
			});
		}

		const { id } = req.params;
		// Find the project
		const project = await Project.findById(id);

		if (!project) {
			return res.status(404).json({
				message: "No such project exists",
			});
		}

		const isStarred = project.starred;

		// Ensure the user owns this project
		if (!project.owner.equals(userId)) {
			return res.status(403).json({
				message: "Not authorized to delete this project",
			});
		}

		// Delete the project
		await Project.findByIdAndDelete(id);
		let key = `projects-${userId}`;
		await redis.del(key);

		if (isStarred) {
			key = `starred-projects-${userId}`;
			await redis.del(key);
		}

		return res.status(200).json({
			message: "Project deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting project:", error);

		return res.status(500).json({
			message: "Error deleting project",
		});
	}
};
