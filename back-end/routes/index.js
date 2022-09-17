const router = require('express').Router();
const registration = require('./registration');
const auth = require('./auth');


router.get('/', (req, res, next) => {
    res.json({ message: 'Spell Corrector API V1.0.0 by Murad Shahsuvarov'})
});

router.use('/registration', registration);

router.use('/auth', auth);

module.exports = router;