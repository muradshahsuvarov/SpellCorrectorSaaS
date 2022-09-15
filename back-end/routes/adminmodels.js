const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Admin Model List Endpoints');
});


module.exports = router;