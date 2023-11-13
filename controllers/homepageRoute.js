const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const auth = require ('../utils/auth');

// Endpoint: http://localhost:3001/ get all the posts on the homepage 
router.get('/', async (req, res) => {
  try {
      const dbPostData = await Post.findAll({
          attributes: ['id', 'title', 'content', 'created_at'],
          include: [
              {
                  model: Comment,
                  attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                  include: {
                      model: User,
                      attributes: ['username']
                  }
              },
              {
                  model: User,
                  attributes: ['username']
              }
          ]
      });

      const posts = dbPostData.map(post => post.get({ plain: true }));
      console.log(posts);
      res.render('homepage', { posts, logged_in:req.session.logged_in });
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});
// Endpoint: http://localhost:3001/login go to the login page
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});


router.get('/signup', (req, res) => {
    res.render('signup');
});


router.get('/dashboard', auth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Post}],
      });
  
      const user = userData.get({ plain: true });
  
      res.render('dashboard', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// get one post route
router.get('/posts/:id', async (req, res) => {
  try{
      const dbPostData = await Post.findOne({
          where: {id: req.params.id},
          attributes: ['id', 'title', 'content', 'created_at'],
          include: [
              {
                  model: Comment,
                  attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                  include: {
                    model: User,
                    attributes: ['username'],
                  },
                },
                {
                  model: User,
                  attributes: ['username'],
                },
          ],
      });
      if (dbPostData) {
          const post = dbPostData.get({ plain: true });
          console.log(post);
          res.render('single-post', { post, logged_in: req.session.logged_in, })  
      } else {
          res.status(404).json({ message: "This id has no post."});
          return;
      }
  } catch (err) {
      res.status(500).json(err);
  }   
});




module.exports = router;
