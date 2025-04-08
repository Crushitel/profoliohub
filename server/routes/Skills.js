const express = require('express');
const router = express.Router();
const SkiilsController = require('../controllers/skillsController');

router.get('/', SkillsController.getSkills);
router.get('/:id', SkillsController.getSkilsById);
router.post('/', SkillsController.createSkills);
router.put('/:id', SkillsController.updateSkills);
router.delete('/:id', SkillsController.deleteSkills);

