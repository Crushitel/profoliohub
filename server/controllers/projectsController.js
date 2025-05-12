const ApiError = require('../Error/ApiError');
const { Projects } = require('../models');
const uuid = require('uuid');
const path = require('path');

class projectsController {
    async getProjects(req, res, next) {
        try {
            const projects = await Projects.findAll();
            if (!projects) {
                return next(ApiError.notFound('No projects found'));
            }
            res.status(200).json(projects);
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
            const { title, description, github_link, demo_link, user_id } = req.body;
            let image_path = null;
            
            // Перевіряємо, чи є файл image в запиті
            if (req.files && req.files.image) {
                const image = req.files.image;
                image_path = uuid.v4() + path.extname(image.name);
                image.mv(path.resolve(__dirname, "..", "static", image_path));
            }

            const newProject = await Projects.create({
                title,
                description,
                image_url: image_path,
                github_link,
                demo_link,
                user_id
            });
            res.status(201).json(newProject);
        } catch (error) {
            console.log(error);
            next(ApiError.internalServerError('Failed to create project'));
        }
    }

    async updateProject(req, res, next) {
        try {
            const { id } = req.params;
            
            // Перевіряємо наявність req.body перед деструктуризацією
            // і використовуємо порожній об'єкт як запасний варіант
            const { title, description, github_link, demo_link } = req.body || {};
            
            const project = await Projects.findOne({ where: { id } });
            if (!project) {
                return next(ApiError.notFound('Project not found'));
            }
            
            let image_path = project.image_url;
            
            // Перевіряємо, чи є файл image в запиті
            if (req.files && req.files.image) {
                const image = req.files.image;
                image_path = uuid.v4() + path.extname(image.name);
                image.mv(path.resolve(__dirname, "..", "static", image_path));
            }

            await project.update({
                title: title || project.title,
                description: description || project.description,
                image_url: image_path,
                github_link: github_link || project.github_link,
                demo_link: demo_link || project.demo_link
            });
            
            // Отримуємо оновлений проект перед відправкою відповіді
            const updatedProject = await Projects.findByPk(id);
            res.status(200).json(updatedProject);
        } catch (error) {
            console.log(error);
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