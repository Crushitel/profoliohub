const ApiError = require('../Error/ApiError');
const { Projects } = require('../models');

class projectsController {
    async getProjects(req, res, next) {
        try {
            const projects = await Projects.findAll();
            if (!projects) {
                return next(ApiError.notFound('No projects found'));
            }
            res.status(200).json(projects); // Moved this line inside the try block
        } catch (error) {
            next(ApiError.internalServerError('Failed to fetch projects'));
        }
    }

    async getProjectById(req, res, next) {
        try {
            const { id } = req.params;
            const project = await Projects.findOne({ where: { id } });
            if (!project) {
                return next(ApiError.notFound('Project not found'));
            }
            res.status(200).json(project);
        } catch (error) {
            console.log(error);
            next(ApiError.internalServerError('Failed to fetch project'));
        }
    }

    async createProject(req, res, next) {
        try {
            const { title, description, image_url, github_link, demo_link, user_id } = req.body;
            const newProject = await Projects.create({
                title,
                description,
                image_url,
                github_link,
                demo_link,
                user_id
            });
            res.status(201).json(newProject);
        } catch (error) {
            next(ApiError.internalServerError('Failed to create project'));
        }
    }
    async updateProject(req, res, next) {
        try {
            const { id } = req.params;
            const { title, description, image_url, github_link, demo_link } = req.body;
            const project = await Projects.findOne({ where: { id } });
            if (!project) {
                return next(ApiError.notFound('Project not found'));
            }
            await project.update({ title, description, image_url, github_link, demo_link });
            res.status(200).json(project);
        } catch (error) {
            next(ApiError.internalServerError('Failed to update project'));
        }
    }
    async deleteProject(req, res, next) {
        try {
            const { id } = req.params;
            const project = await Projects.findOne({ where: { id } });
            if (!project) {
                return next(ApiError.notFound('Project not found'));
            }
            await project.destroy();
            res.status(204).json();
        } catch (error) {
            next(ApiError.internalServerError('Failed to delete project'));
        }
    }
}

module.exports = new projectsController();