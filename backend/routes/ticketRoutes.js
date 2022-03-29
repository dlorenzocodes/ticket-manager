const express = require('express');
const router = express.Router();

const { 
    getTickets, 
    createTicket, 
    getTicket, 
    deleteTicket, 
    updateTicket 
} = require('../controllers/ticketController');
const { protectPrivateRoute } = require('../middleware/authMiddleware');

router.route('/')
    .get(protectPrivateRoute, getTickets)
    .post(protectPrivateRoute, createTicket);

router.route('/:ticketId')
    .get(protectPrivateRoute, getTicket)
    .delete(protectPrivateRoute, deleteTicket)
    .put(protectPrivateRoute, updateTicket);

module.exports = router;