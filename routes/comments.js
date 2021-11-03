const express = require('express')
const router = express.Router({mergeParams:true});
const Lecture = require('../models/lecture')
const Comment = require('../models/comment')

router.get("/new", (req, res) => {
    const {id,lectureId} = req.params
    res.render("comments/new",{id,lectureId})
})
router.post("/", async (req, res) => {
    const { id,lectureId } = req.params
    const lecture = await Lecture.findById(lectureId);
    const comment = new Comment(req.body.comment)
    lecture.comments.push(comment)
    await comment.save();
    await lecture.save();
    req.flash('success', "Added question")
    res.redirect(`/courses/${id}/lectures/${lectureId}`)
})

router.route('/:commentId')
    .post(async (req, res) => {
        const { id, lectureId,commentId } = req.params
        const foundComment = await Comment.findById(commentId);
        const addedComment = new Comment(req.body.comment)
        foundComment.comments.push(addedComment);
        //console.log(foundComment)
        //console.log(addedComment)
        await addedComment.save()
        await foundComment.save()
        req.flash('success', "Added reply")
        res.redirect(`/courses/${id}/lectures/${lectureId}`)
    })
    .put(async (req, res) => {
        console.log(req.params)
        console.log(req.body)
        console.log(req.body.comment)
        const { id, lectureId, commentId } = req.params
        const comment = await Comment.findById(commentId);//AndUpdate(commentId, ...req.body.comment);
        comment.topic = req.body.comment.topic;
        await comment.save();
        console.log(comment)
        req.flash('success', "Updated comment")
        res.redirect(`/courses/${id}/lectures/${lectureId}`)
    })
    .delete(async (req, res) => {
        const { id, lectureId, commentId } = req.params
        await Comment.findByIdAndDelete(commentId);
        req.flash('success', "Deleted Comment")
        res.redirect(`/courses/${id}/lectures/${lectureId}`)
    })

    
router.get('/:commentId/reply', (req, res) => {
    const { id, lectureId,commentId } = req.params
    res.render("comments/reply", { id, lectureId,commentId })
})
router.get('/:commentId/edit', async(req, res) => {
    const { id, lectureId,commentId } = req.params
    const foundComment = await Comment.findById(commentId)
    res.render("comments/edit", { id, lectureId,comment:foundComment })
})

module.exports = router;