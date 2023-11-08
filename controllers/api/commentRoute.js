const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// end point: http://localhost:3001/api/comments/
router.get('/', async(req, res) => {
    try{
        const dbCommentData = await Comment.findAll({
        attributes: [
            'id', 
            'comment_text', 
            'post_id', 
            'user_id', 
            'created_at'
        ],
        include: [{
            model: User,
            attributes: ['username']
        }]
    });
    const comments = dbCommentData.map((comment)=>
        comment.get({plain:true})
        );
        res.render('comment',{
            comments,
        logged_in:req.session.logged_in,
        });
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});


// end point: http://localhost:3001/api/comments/
router.post('/', withAuth, async(req, res) => {
    try{
        const newComment = await Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,
        });
        req.session.save(()=>{
            req.session.logged_in = true;
            res.status(500).json(newComment);
        });   
    } catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// end point: http://localhost:3001/api/comments/:id
router.put('/:id', withAuth, async (req, res) => {
    try {
        const commentUpdate = await Comment.update({
            comment_text: req.body.comment_text
        },
        {
            where: {
                id: req.params.id
            }
        });
        
        if (commentUpdate[0] === 0) {
            res.status(404).json({ message: 'No comment found with this id' });
        } else {
            res.status(200).json({ message: 'Comment updated successfully' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// end point: http://localhost:3001/api/comments/:id
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const deletedComment = await Comment.destroy({
            where: {
                id: req.params.id
            }
        });

        if (deletedComment === 0) {
            res.status(404).json({ message: 'No comment found with this id' });
        } else {
            res.status(200).json({ message: 'Comment deleted successfully' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;