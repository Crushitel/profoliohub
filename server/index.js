require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');
const cors = require('cors');
const ErrorHandler = require('./middleware/ErrorHandlingMiddleware');
app.use(express.json());

app.use(cors());

// routers
const projectsRouter = require('./routes/Projects');
app.use('/api/projects', projectsRouter);
const usersRouter = require('./routes/Users');
app.use('/api/user', usersRouter);
const ExperiencesRouter = require('./routes/Experiences');
app.use('/api/Experiences', ExperiencesRouter);
const TestimonialsRouter = require('./routes/Testimonials');
app.use('/api/Testimonials', TestimonialsRouter);


// Error handling middleware
app.use(ErrorHandler);


db.sequelize.sync({ force: false }).then(() => {
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
});
