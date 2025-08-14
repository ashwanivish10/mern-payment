const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getDashboardDetails, transfer } = require('../controllers/accountController');
const router = express.Router();

router.get('/dashboard', authMiddleware, getDashboardDetails);
router.post('/transfer', authMiddleware, transfer);

module.exports = router;