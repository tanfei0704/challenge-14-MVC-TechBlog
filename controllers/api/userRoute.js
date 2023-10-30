const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// Endpoint: http://localhost:3001/api/users/
router.get('/', async (req, res) => {
    try {
        const dbUserData = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/users/:id
router.get('/:id', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Post,
                    attributes: ['id', 'title', 'content', 'created_at']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                },
                {
                    model: Post,
                    attributes: ['title']
                }
            ]
        });

        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }

        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/users/
// CREATE new user
router.post('/', async (req, res) => {
    try {
        const dbUserData = await User.create({
            username: req.body.username,
            password: req.body.password
        });

        req.session.loggedIn = true;
        res.render('dashboard', { loggedIn: true });
        res.status(200).json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/users/login
router.post('/login', async (req, res) => {
    try {
        const dbUserData = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!dbUserData) {
            res.status(400).json({ message: 'Incorrect username. Please try again!' });
            return;
        }

        const validPassword = await dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password. Please try again!' });
            return;
        }

        req.session.loggedIn = true;
        res.status(200).json({ user: dbUserData, message: 'You are now logged in!' });
        res.render('dashboard',{loggedIn});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/users/logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// Endpoint: http://localhost:3001/api/users/:id
router.put('/:id', async (req, res) => {
    try {
        const dbUserData = await User.update(req.body, {
            where: {
                id: req.params.id
            }
        });

        if (dbUserData[0] === 0) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }

        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/users/:id
router.delete('/:id', async (req, res) => {
    try {
        const dbUserData = await User.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }

        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
