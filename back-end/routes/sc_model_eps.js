const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.send('Spell Corrector Model Endpoints');
});


module.exports = router;