const User = require('../models/uderModel');
const Ticket = require('../models/ticketModel');
const Note = require('../models/noteModel')

// @desc   Get notes for a ticket
// @route  GET /api/tickets/:ticketId/notes
// @access Private
const getNotes = async (req, res, next) => {
    try{
        // get user using the id in the JWT
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401);
            throw new Error('User not found');
        }
        const ticket = await Ticket.findById(req.params.ticketId);

        if(ticket.user.toString() !== req.user.id){
            res.status(401);
            throw new Error('User not authorized')
        }

        const notes = await Note.find({ ticket: req.params.ticketId})
        res.status(200).json(notes);
    }catch(err){
        next(err);
    }
};


// @desc   create ticket note
// @route  POST /api/tickets/:ticketId/notes
// @access Private
const createNote = async (req, res, next) => {
    try{
        // get user using the id in the JWT
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401);
            throw new Error('User not found');
        }
        const ticket = await Ticket.findById(req.params.ticketId);

        if(ticket.user.toString() !== req.user.id){
            res.status(401);
            throw new Error('User not authorized')
        }

        const note = await Note.create(
            { 
                text: req.body.text,
                ticket: req.params.ticketId,
                isStaff: false,
                user: req.user.id
            }
        )
        res.status(200).json(note);
    }catch(err){
        next(err);
    }
};



module.exports = {
    getNotes,
    createNote
}