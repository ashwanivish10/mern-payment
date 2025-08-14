const express = require('express');
const userRouter = require('./userRoutes');
const accountRouter = require('./accountRoutes');

const router = express.Router();

router.use('/users', userRouter);
router.use('/account', accountRouter);

module.exports = router;