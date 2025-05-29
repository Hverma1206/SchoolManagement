const express = require('express');
const router = express.Router();
const controller = require('../controller/school');

router.post('/addSchool', controller.addSchool);
router.get('/listSchools', controller.listSchools);

module.exports = router;
