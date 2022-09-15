const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('User Model List Endpoints');
});


module.exports = router;