const { Testimonials } = require('../models');
const ApiError = require('../Error/ApiError');
class TestimonialsController{
    async createTestimonial(req, res, next) {
        const { rating, comment, user_id, testimonials_id } = req.body;
        try {
            const testimonial = await Testimonials.create({
                rating,
                comment,
                user_id,
                testimonials_id
            });
            return res.status(201).json(testimonial);
        } catch (error) {
            next(ApiError.internalServerError("Failed to create Testimonial"));
            console.log(error);
        }
    }

    async getTestimonials(req, res, next) {
        try {
            const testimonials = await Testimonials.findAll();
            if (!testimonials || testimonials.length === 0) {
                return next(ApiError.notFound("No Testimonials found"));
            }
            return res.status(200).json(testimonials);
        } catch (error) {
            return next(ApiError.internalServerError("Failed to fetch Testimonials"));
        }
    }

    async getTestimonialById(req, res, next) {
        const { id } = req.params;
        try {
            const testimonial = await Testimonials.findOne({ where: { id } });
            if (!testimonial) {
                return next(ApiError.notFound("Testimonial not found"));
            }
            return res.status(200).json(testimonial);
        } catch (error) {
            return next(ApiError.internalServerError("Failed to fetch Testimonial"));
        }
    }

    async updateTestimonial(req, res, next) {
        const { id } = req.params;
        const { rating, comment } = req.body;
        try {
            const testimonial = await Testimonials.findOne({ where: { id } });
            if (!testimonial) {
                return next(ApiError.notFound("Testimonial not found"));
            }
            await testimonial.update({ rating, comment });
            return res.status(200).json(testimonial);
        } catch (error) {
            next(ApiError.internalServerError("Failed to update Testimonial"));
            console.log(error);
        }
    }

    async deleteTestimonial(req, res, next) {
        const { id } = req.params;
        try {
            const testimonial = await Testimonials.findOne({ where: { id } });
            if (!testimonial) {
                return next(ApiError.notFound("Testimonial not found"));
            }
            await testimonial.destroy();
            return res.status(200).json({ message: "Testimonial deleted successfully" });
        } catch (error) {
            return next(ApiError.internalServerError("Failed to delete Testimonial"));
        }
    }   
};

module.exports = new TestimonialsController();