const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Manage Users Endpoints');
});


module.exports = router;