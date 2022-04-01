const express = require('express');
const router = express.Router({ mergeParams: true });

const { protectPrivateRoute } = require('../middleware/authMiddleware');
const { getNotes, createNote } = require('../controllers/noteController');

router.route('/')
    .get(protectPrivateRoute, getNotes)
    .post(protectPrivateRoute, createNote);



module.exports = router;


// Route Nesting - /notes will be nested into the tickets route
// the path for notes is the same as tickets
//  /api/tickets/:ticketId/notes