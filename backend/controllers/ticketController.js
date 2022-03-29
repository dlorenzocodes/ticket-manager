const User = require('../models/uderModel');
const Ticket = require('../models/ticketModel');

// @desc   Get user tickets
// @route  GET /api/tickets
// @access Private
const getTickets = async (req, res, next) => {

    try{
        // get user using the id in the JWT
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401);
            throw new Error('User not found');
        }
        const tickets = await Ticket.find({ user: req.user.id })
        res.status(200).json(tickets);
    }catch(err){
        next(err);
    }
}

// @desc   Get user ticket
// @route  GET /api/tickets/:ticketId
// @access Private
const getTicket = async (req, res, next) => {

    try{
        // get user using the id in the JWT
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401);
            throw new Error('User not found');
        }

        const ticket = await Ticket.findById(req.params.ticketId);
        if(!ticket){
            res.status(404);
            throw new Error('Ticket not found');
        }

        if(ticket.user.toString() !== req.user.id){
            res.status(401);
            throw new Error('Not authorized')
        }

        res.status(200).json(ticket);
    }catch(err){
        next(err);
    }
}

// @desc   Get user tickets
// @route  POST /api/tickets
// @access Private
const createTicket = async (req, res, next) => {
    try{
        const { product, description } = req.body;
        if(!product || !description){
            res.status(400);
            throw new Error('Please add product and description');
        }

        // get user using the id in the JWT
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401);
            throw new Error('User not found');
        }

        const ticket = await Ticket.create({
            product,
            description,
            user: req.user.id,
            status: 'new'
        });

        res.status(201).json(ticket);
    }catch(err){
        next(err)
    }

}


// @desc   Deletes user ticket
// @route  DELETE /api/tickets/:ticketId
// @access Private
const deleteTicket = async (req, res, next) => {
    try{
        // get user using the id in the JWT
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401);
            throw new Error('User not found');
        }

        const ticket = await Ticket.findById(req.params.ticketId);
        if(!ticket){
            res.status(404);
            throw new Error('Ticket not found');
        }

        if(ticket.user.toString() !== req.user.id){
            res.status(401);
            throw new Error('Not authorized')
        }

        await ticket.remove();

        res.status(200).json({ success: true});
    }catch(err){
        next(err);
    }
}


// @desc   Updates user ticket
// @route  PUT /api/tickets/:ticketId
// @access Private
const updateTicket = async (req, res, next) => {
    try{
        // get user using the id in the JWT
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401);
            throw new Error('User not found');
        }

        const ticket = await Ticket.findById(req.params.ticketId);
        if(!ticket){
            res.status(404);
            throw new Error('Ticket not found');
        }

        if(ticket.user.toString() !== req.user.id){
            res.status(401);
            throw new Error('Not authorized')
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.ticketId, 
            req.body, 
            { new: true }
        );

        res.status(200).json(updatedTicket);
    }catch(err){
        next(err);
    }
}




module.exports = {
    getTickets,
    createTicket,
    getTicket,
    deleteTicket,
    updateTicket
}