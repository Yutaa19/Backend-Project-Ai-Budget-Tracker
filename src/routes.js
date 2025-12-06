const express = require('express');
const router =  express.Router();

const userRoute = require('./modules/user/user.route');
const transactionRoute = require('./modules/transaction/transaction.routes');
const authRoutes = require('./modules/auth/auth.route');
const NotFound = require('./errors/NotFoundError');

router.use('/auth', authRoutes);
router.use('/transaction', transactionRoute);
router.use('/users', userRoute);

router.use((req, res) => {
    throw new NotFound('Route Tidak Di Temukan')
})

module.exports = router;