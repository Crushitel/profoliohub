const express = require('express');
const router = express.Router();
const SkillsController = require('../controllers/skillsController');

router.get('/', SkillsController.getAllSkills);
router.get('/:id', SkillsController.getSkillById);
router.post('/', SkillsController.createSkill);
router.put('/:id', SkillsController.updateSkill);
router.delete('/:id', SkillsController.deleteSkill);

module.exports = router;