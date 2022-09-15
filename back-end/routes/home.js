const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Home Endpoints');
});

module.exports = router;