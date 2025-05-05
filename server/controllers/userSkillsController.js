const { UserSkill } = require('../models');
const ApiError = require('../Error/ApiError');
class UserSkillsController{

    async getAllUserSkills(req, res, next) {
        try {
            const userSkills = await UserSkill.findAll();
            res.status(200).json(userSkills);
        } catch (error) {
            return next(ApiError.internalServerError('Error while getting user skills'));
        }
    }
    async createUserSkill(req, res, next) {
        try {
            const { proficiency, user_id, skill_id } = req.body;
            const userSkill = await UserSkill.create({ proficiency, user_id, skill_id });
            res.status(201).json(userSkill);
        } catch (error) {
            next(ApiError.internalServerError('Error while creating user skill'));
            console.log(error);
        }
    }
    async getUserSkillById(req, res, next) {
        try {
            const { id } = req.params;
            const userSkill = await UserSkill.findByPk(id);
            if (!userSkill) {
                return next(ApiError.notFound('User skill not found'));
            }
            res.status(200).json(userSkill);
        } catch (error) {
            return next(ApiError.internal('Error while getting user skill'));
        }
    }
    async updateUserSkill(req, res, next) {
        try {
            const { id } = req.params;
            const { proficiency } = req.body;
            const userSkill = await UserSkill.findByPk(id);
            if (!userSkill) {
                return next(ApiError.notFound('User skill not found'));
            }
            userSkill.proficiency = proficiency;
            await userSkill.save();
            res.status(200).json(userSkill);
        } catch (error) {
            return next(ApiError.internal('Error while updating user skill'));
        }
    }
    async deleteUserSkill(req, res, next) {
        try {
            const { id } = req.params;
            const userSkill = await UserSkill.findByPk(id);
            if (!userSkill) {
                return next(ApiError.notFound('User skill not found'));
            }
            await userSkill.destroy();
            res.status(204).json();
        } catch (error) {
            return next(ApiError.internal('Error while deleting user skill'));
        }
    }

};

module.exports = new UserSkillsController();