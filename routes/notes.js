const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE1 :  FETCH ALL NOTES using GET "/api/v1/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const userid = req.user
    const notes = await Notes.find({ user: userid });
    res.json(notes)
});

//ROUTE2 :  Add Notes using POST "/api/v1/notes/addnote"
router.post('/addnote',
    body('title', 'Note title should be more than 2 characters!').isLength({ min: 2 }),
    body('description', 'Note title should be more than 5 characters!').isLength({ min: 5 })
    , fetchuser, async (req, res) => {
        //error response
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        try {
            const userid = req.user;
            const note = await Notes.create({
                user: userid,
                title: req.body.title,
                description: req.body.description,
                tag: req.body.tag,
            });
            res.json(note)
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error!");
        }
    });



module.exports = router