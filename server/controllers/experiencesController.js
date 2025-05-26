const ApiError = require("../Error/ApiError");
const { Experiences } = require("../models");

class ExperiencesController {
    async createExperience(req, res, next) {
        const {
            title,
            company,
            position,
            start_date,
            end_date,
            description,
            user_id,
        } = req.body;
        try {
            const formattedEndDate = end_date === "" ? null : end_date;

            const experiences = await Experiences.create({
                title,
                company,
                position,
                start_date,
                end_date: formattedEndDate,
                description,
                user_id,
            });
            return res.status(201).json(experiences);
        } catch (error) {
            next(ApiError.internalServerError("Failed to create Experiences"));
            console.log(error);
        }
    }

    async getExperiences(req, res, next) {
        try {
            const experiences = await Experiences.findAll();
            if (!experiences || experiences.length === 0) {
                return next(ApiError.notFound("No Experiences found"));
            }
            return res.status(200).json(experiences);
        } catch (error) {
            return next(ApiError.internalServerError("Failed to fetch Experiences"));
        }
    }
    async getExperienceById(req, res, next) {
        const { id } = req.params;
        try {
            const experience = await Experiences.findOne({ where: { id } });
            if (!experience) {
                return next(ApiError.notFound("Experiences not found"));
            }
            return res.status(200).json(experience);
        } catch (error) {
            return next(ApiError.internalServerError("Failed to fetch Experiences"));
        }
    }
    async updateExperience(req, res, next) {
        const { id } = req.params;
        const { title, company, position, start_date, end_date, description } =
            req.body;
        try {
            const experiences = await Experiences.findOne({ where: { id } });
            if (!experiences) {
                return next(ApiError.notFound("Experiences not found"));
            }

            const formattedEndDate = end_date === "" ? null : end_date;

            await experiences.update({
                title,
                company,
                position,
                start_date,
                end_date: formattedEndDate,
                description,
            });

            return res.status(200).json(experiences);
        } catch (error) {
            next(ApiError.internalServerError("Failed to update Experiences"));
            console.log(error);
        }
    }
    async deleteExperience(req, res, next) {
        const { id } = req.params;
        try {
            const experiences = await Experiences.findOne({ where: { id } });
            if (!experiences) {
                return next(ApiError.notFound("Experiences not found"));
            }
            await experiences.destroy();
            return res.status(204).json();
        } catch (error) {
            return next(ApiError.internalServerError("Failed to delete Experiences"));
        }
    }
}

module.exports = new ExperiencesController();
