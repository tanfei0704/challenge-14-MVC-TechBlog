const router = require('express').Router();
const { Comment } = require('../../models');
const auth = require('../../utils/auth');

// get comments ('api/comments')
router.get('/', async (req, res) => {
  try{ 
    const dbCommentData = await Comment.findAll({});
    if (dbCommentData.length === 0) {
      res.status(404).json({ message: "You have no comment."});
      return;
    };
    res.status(200).json(dbCommentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all the comments from 1 post
router.get('/:id', async (req, res) => {
  try {
      const commentData = await Comment.findAll({
          where: { id: req.params.id },
      });
      if (commentData.length === 0) {
          res.status(404).json({ message: `The id ${req.params.id} has no comment.` });
          return;
      }
      res.status(200).json(commentData);
  } catch (err) {
      res.status(500).json(err);
  }
});

// create comment ('/api/comments')
router.post('/', auth, async (req, res) => {
    const body = req.body;
    try {
        const newComment = await Comment.create({
            ...body,
            user_id: req.session.user_id,
        });
        res.status(200).json({ newComment, success: true });
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete comment ('api/comments/:id')
router.delete('/:id', auth, async (req, res) => {
    try {
      const dbCommentData = await Comment.destroy({
        where: {id: req.params.id},
      });        
      if (!dbCommentData) {
        res.status(404).json({
          message: `No comment is found with id = ${req.params.id}`,
        });
        return;
      }  
      res.status(200).json({dbCommentData, success: true});
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;