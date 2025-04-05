const express = require('express');
const app = express();
const db = require('./models');
app.use(express.json());

// routers
const projectsRouter = require('./routes/Projects');
app.use('/api/projects', projectsRouter);
const usersRouter = require('./routes/Users');
app.use('/api/auth', usersRouter);


db.sequelize.sync({ force: false }).then(() => {
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
});
