const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const auth = require('../../utils/auth');


//create a new post  Endpoint: http://localhost:3001/api/posts
router.post('/', auth, async (req, res) => {
    try {
      const newPost = await Post.create({
        ...req.body,
        user_id: req.session.user_id,
      });
  
      res.status(200).json(newPost);
    } catch (err) {
      res.status(400).json(err);
    }
  });

//edit post Endpoint: http://localhost:3001/api/posts/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const updatedPost = await Post.findOne({
      where: {
        id: req.params.id,
      }, 
    });
    if (!updatedPost) {
      res.status(404).json({ message: 'This id has no post' });
      return;
    }  
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//edit post Endpoint: http://localhost:3001/api/posts/:id
router.put('/:id', auth, async (req, res) => {
    try {
      const updatedPost = await Post.update(
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (!updatedPost) {
        res.status(404).json({ message: 'This id has no post' });
        return;
      }  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json(err);
    }
});


// Endpoint: http://localhost:3001/api/posts/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id
            }
        });

        if (postData === 0) {
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
