const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projectsController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/', projectsController.getProjects);

router.get('/:id', projectsController.getProjectById);

router.post('/', authMiddleware, projectsController.createProject);
router.put('/:id', authMiddleware, projectsController.updateProject);
router.delete('/:id', authMiddleware, projectsController.deleteProject);

module.exports = router;