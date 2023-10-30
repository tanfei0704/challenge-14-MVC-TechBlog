const router = require('express').Router();

const userRoutes = require('./userRoute.js');
const postRoutes = require('./postRoute.js');
const commentRoutes = require('./commentRoute.js');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;