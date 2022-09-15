const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Edit Profile Endpoints');
});


module.exports = router;