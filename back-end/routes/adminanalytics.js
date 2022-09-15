const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Admin Analytics Endpoints');
});


module.exports = router;