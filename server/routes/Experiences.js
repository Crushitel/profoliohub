const express = require('express');
const router = express.Router();
const ExperiencesController = require('../controllers/experiencesController');

router.get('/', ExperiencesController.getExperiences);
router.get('/:id', ExperiencesController.getExperiencesById);
router.post('/', ExperiencesController.createExperiences);
router.put('/:id', ExperiencesController.updateExperiences);
router.delete('/:id', ExperiencesController.deleteExperiences);


module.exports = router;