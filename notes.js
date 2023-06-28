const express = require('express');
const router = express.Router();
const fetchUser = require('../middlewares/fetchUser');
const Note = require('../models/Notes')
const { body, validationResult } = require('express-validator');
//Router 1 : get all notes using get function

router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error)
    }
})
//Router 2 : Add new notes
router.post('/getnotes', fetchUser, [
    body('title', 'Enter the title').isLength({ min: 3 }),
    body('description', 'Enter the description').isLength({ min: 5 }),
], async (req, res) => {

    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote);


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Notes Not added" });
    }
})
//Router 3: update notes using the put method
router.put('/updatenote/:id', fetchUser, async (req, res) => {

    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }


    let note = await Note.findById(req.params.id);
    //the user who has created the note must edit the note
    if (!note) {
        //note does not exist
        return res.status(404).json({ message: "Note not found" });
    }
    //Check id of note is same as the user who created the note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not allowed" })
    }
    //else update the note 
    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });

})


//Router 4: delete notes using the put method
router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    const { title, description, tag } = req.body;
    let note = await Note.findById(req.params.id);
    //the user who has created the note must edit the note
    if (!note) {
        //note does not exist
        return res.status(404).json({ message: "Note not found" });
    }
    //Check id of note is same as the user who created the note
    if (note.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not allowed" })
    }
    //else delete the note 
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "Sucess": "Deleted note" });

})

module.exports = router;




//Login auth token


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ5YmM2ODUwZWZhZDc3MmQyZDNjZWJkIn0sImlhdCI6MTY4NzkzMjU3M30.-ss9FxjOfFYdtdIcpGt5OPDnypJPicgOhpDlXGIWoDk
