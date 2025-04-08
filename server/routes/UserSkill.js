const express = require('express');
const router = express.Router();
const UserSkillsController = require('../controllers/userSkillsController');

router.get('/', UserSkillsController.getUserSkills);
router.get('/:id', UserSkillsController.getUserSkillById);
router.post('/', UserSkillsController.createUserSkill);
router.put('/:id', UserSkillsController.updateUserSkill);
router.delete('/:id', UserSkillsController.deleteUserSkill);

