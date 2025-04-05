const express = require('express');
const router = express.Router();
const { Project } = require('../models'); 

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Projects API',
  });
});

router.post("/", async (req, res) => {
    const oneproject = req.body;
    await Project.create(oneproject);
    res.json(oneproject);
});

module.exports = router;