'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

router.use('/auth', require('./authRoutes'));
// router.use('/users');
// router.use('/clients');

module.exports = router;
