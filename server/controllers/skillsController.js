const { Skill } = require('../models');
const ApiError = require('../Error/ApiError');
class SkillsController{
    async getAllSkills(req, res, next) {
        try {
            const skills = await Skill.findAll();
            res.status(200).json(skills);
        } catch (error) {
            return next(ApiError.internal('Error while getting skills'));
        }
    }

    async createSkill(req, res, next) {
        try {
            const { name } = req.body;
            const skill = await Skill.create({ name });
            res.status(201).json(skill);
        } catch (error) {
            return next(ApiError.internal('Error while creating skill'));
        }
    }

    async getSkillById(req, res, next) {
        try {
            const { id } = req.params;
            const skill = await Skill.findByPk(id);
            if (!skill) {
                return next(ApiError.notFound('Skill not found'));
            }
            res.status(200).json(skill);
        } catch (error) {
            return next(ApiError.internal('Error while getting skill'));
        }
    }

    async updateSkill(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const skill = await Skill.findByPk(id);
            if (!skill) {
                return next(ApiError.notFound('Skill not found'));
            }
            skill.name = name;
            await skill.save();
            res.status(200).json(skill);
        } catch (error) {
            return next(ApiError.internal('Error while updating skill'));
        }
    }

    async deleteSkill(req, res, next) {
        try {
            const { id } = req.params;
            const skill = await Skill.findByPk(id);
            if (!skill) {
                return next(ApiError.notFound('Skill not found'));
            }
            await skill.destroy();
            res.status(204).json();
        } catch (error) {
            return next(ApiError.internal('Error while deleting skill'));
        }
    }
};

module.exports = new SkillsController();