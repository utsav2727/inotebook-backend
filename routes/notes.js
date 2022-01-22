const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE1 :  FETCH ALL NOTES using GET "/api/v1/notes/fetchallnotes"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const userid = req.user;
        const notes = await Notes.find({ user: userid });
        res.json(notes)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
    }
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

//ROUTE3 :  Update Notes using POST "/api/v1/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body
        let newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find by ID and update.
        const userid = req.user;
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send('File not found!');
        };
        if (note.user != userid) {
            return res.status(401).send('Not able to update Notes!');
        }
        note = await Notes.findOneAndUpdate(req.params.id, { $set: newNote }, { new: true });
        return res.json(note)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
    }
});

//ROUTE4 :  Delete Notes using POST "/api/v1/notes/deletenote"
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find by ID and delete.
        const userid = req.user;
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send('File not found!');
        };
        if (note.user != userid) {
            return res.status(401).send('Not able to update Notes!');
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        return res.send(`Note has been deleted with ${note.id}`)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
    }
});

module.exports = router