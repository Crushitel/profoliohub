const express = require('express');
const router = express.Router();
const UserSkillsController = require('../controllers/userSkillsController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/', UserSkillsController.getAllUserSkills);
router.get('/:id', UserSkillsController.getUserSkillById);
router.post('/', authMiddleware, UserSkillsController.createUserSkill);
router.put('/:id', authMiddleware, UserSkillsController.updateUserSkill);
router.delete('/:id', authMiddleware, UserSkillsController.deleteUserSkill);

module.exports = router;
