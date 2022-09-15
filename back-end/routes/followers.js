const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Followers Endpoints');
});


module.exports = router;