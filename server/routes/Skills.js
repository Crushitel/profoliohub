const express = require('express');
const router = express.Router();
const SkillsController = require('../controllers/skillsController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/', SkillsController.getAllSkills);
router.get('/:id', SkillsController.getSkillById);
router.post('/', authMiddleware, SkillsController.createSkill);
router.put('/:id', authMiddleware, SkillsController.updateSkill);
router.delete('/:id', authMiddleware, SkillsController.deleteSkill);

module.exports = router;