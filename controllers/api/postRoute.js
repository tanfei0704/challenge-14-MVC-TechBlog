const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Endpoint: http://localhost:3001/api/posts/
router.get('/', async (req, res) => {
    try {
        const dbPostData = await Post.findAll({
            attributes: ['id', 'title', 'content', 'created_at'],
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        });

        res.json(dbPostData.reverse());
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/posts/:id
router.get('/:id', async (req, res) => {
    try {
        const dbPostData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'title', 'content', 'created_at'],
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }
            ]
        });

        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.json(dbPostData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/posts/
router.post('/', withAuth, async (req, res) => {
    try {
        const dbPostData = await Post.create({
            title: req.body.title,
            content: req.body.content,
            user_id: req.session.user_id
        });

        res.json(dbPostData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/posts/:id
router.put('/:id', withAuth, async (req, res) => {
    try {
        const [numRowsAffected, dbPostData] = await Post.update(
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                where: {
                    id: req.params.id
                },
                returning: true
            }
        );

        if (numRowsAffected === 0) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.json(dbPostData[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Endpoint: http://localhost:3001/api/posts/:id
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const numRowsAffected = await Post.destroy({
            where: {
                id: req.params.id
            }
        });

        if (numRowsAffected === 0) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
