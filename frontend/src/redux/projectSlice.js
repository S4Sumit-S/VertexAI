import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
	name: "projects",
	initialState: {
		projects: [],
	},
	reducers: {
		setProjects: (state, action) => {
			state.projects = action.payload;
		},
		addNewProject: (state, action) => {
			state.projects.unshift(action.payload);
		},
		starProject: (state, action) => {
			const project = state.projects.find((p) => p._id == action.payload);
			if (project) {
				project.starred = !project.starred;
			}
		},
	},
});

export const { setProjects, addNewProject, starProject } = projectSlice.actions;
export default projectSlice.reducer;
