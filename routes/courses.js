const express = require('express')
const router = express.Router();
const Course = require("../models/course")

const { isLoggedIn } = require('../middleware')

router.route('/')
    .get(async(req, res) => {
        const courses = await Course.find({});
        //console.log(courses)
        res.render("courses/index",{courses})
    })
    .post(isLoggedIn, async(req, res) => {
        const course = new Course(req.body.course)
        await course.save();
        req.flash('success',"Created a new course")
        res.redirect("/courses")
    })

router.get('/new',isLoggedIn, (req, res) => {
    res.render("courses/new")
})

router.route('/:id')
    .get(async (req, res) => {
        const {id} = req.params
        const course = await Course.findById(id).populate('lectures')
        res.render('courses/show',{course})
    })
    .put(isLoggedIn, async(req, res) => {
        const { id } = req.params
        const course = await Course.findByIdAndUpdate(id,{...req.body.course})
         req.flash('success',"Updated course")
        res.redirect(`/courses/${id}`)
    })
    .delete(isLoggedIn, async (req, res) => {
        const { id } = req.params
        await Course.findByIdAndDelete(id)
        req.flash('success',"Deleted course")
        res.redirect('/courses')
    })
    
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params
    const course = await Course.findById(id)
    res.render('courses/edit', { course })
})

module.exports = router;