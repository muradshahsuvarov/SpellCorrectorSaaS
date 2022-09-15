const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Dashboard Endpoints');
});


module.exports = router;