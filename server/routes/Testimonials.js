const express = require('express');
const router = express.Router();
const TestimonialsController = require('../controllers/testimonialsController');
const authMiddleware = require('../middleware/AuthMiddleware');

router.get('/', TestimonialsController.getTestimonials);
router.get('/:id', TestimonialsController.getTestimonialById);
router.post('/', authMiddleware, TestimonialsController.createTestimonial);
router.put('/:id', authMiddleware, TestimonialsController.updateTestimonial);
router.delete('/:id', authMiddleware, TestimonialsController.deleteTestimonial);

module.exports = router;