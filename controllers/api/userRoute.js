const router = require('express').Router();
const { User } = require('../../models');
const auth = require('../../utils/auth');

// Endpoint: http://localhost:3001/api/users/
// CREATE new user
router.post('/', async (req, res) => {
    try {
        const userData = await User.create({
            username: req.body.username,
            email:req.body.email,
            password: req.body.password
        });
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.json({ user: userData, message: 'You are now logged in!' });
          });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// login user Endpoint: http://localhost:3001/api/users/login
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: {
                email:req.body.email,
            }
        });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect username or email. Please try again!' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password. Please try again!' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.json({ user: userData, message: 'You are now logged in!' });
          });
       
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

// logout user Endpoint: http://localhost:3001/api/users/logout
router.post('/logout', auth, async (req, res) => {
    try {
        if (req.session.logged_in) {
            await req.session.destroy(() => {
                res.status(204).end();
            });
        } else {
            res.status(404).end();
        }
    } catch {
        res.status(400).end();
    }
});

module.exports = router;
