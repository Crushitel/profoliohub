const express = require('express');
const router = express.Router();
const ExperiencesController = require('../controllers/experiencesController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/', ExperiencesController.getExperiences);
router.get('/:id', ExperiencesController.getExperienceById);
router.post('/', authMiddleware, ExperiencesController.createExperience);
router.put('/:id', authMiddleware, ExperiencesController.updateExperience);
router.delete('/:id', authMiddleware, ExperiencesController.deleteExperience);


module.exports = router;