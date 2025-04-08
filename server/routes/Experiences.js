const express = require('express');
const router = express.Router();
const ExperiencesController = require('../controllers/experiencesController');

router.get('/', ExperiencesController.getExperiences);
router.get('/:id', ExperiencesController.getExperienceById);
router.post('/', ExperiencesController.createExperience);
router.put('/:id', ExperiencesController.updateExperience);
router.delete('/:id', ExperiencesController.deleteExperience);


module.exports = router;