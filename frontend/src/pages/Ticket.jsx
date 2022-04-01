import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import Spinner from '../components/Spinner'
import NoteItem from '../components/NoteItem'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import { useSelector, useDispatch } from 'react-redux'
import { getTicket, closeTicket } from '../features/tickets/tickets'
import { getNotes } from '../features/notes/notes'
import { FaPlus } from 'react-icons/fa'


const customStyles = {
  content:{
    width: '600px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%',
    position: 'relative'
  },
}

Modal.setAppElement('#root')

function Ticket() {

  const [ modalIsOpen, setModalIsOpen ] = useState(false)
  const [noteText, setNoteText] = useState('')

  const {  ticket, isLoading, isError, message } = useSelector(
    state => state.tickets
  )

  const { notes, isLoading: notesLoading } = useSelector(
    state => state.notes
  )

  const params = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(isError){
      toast.error(message)
    }
    
    dispatch(getTicket(params.id))
    dispatch(getNotes(params.id))
  }, [dispatch, isError, message, params.id])

  const onTicketClosed = () => {
    dispatch(closeTicket(params.id))
    toast.success('Ticket closed')
    navigate('/tickets')
  }

  const onNoteSubmit = (e) => {
    e.preventDefault()
    console.log('submit')
    closeModal()
  }

  // Open/Closed Model
  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  if(isLoading || notesLoading) return <Spinner />

  if(isError) return <h3>Something Went Wrong</h3>

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <BackButton url='/tickets' />
        <h2>
          Ticket ID: {ticket._id}
          <span 
            className={`status status-${ticket.status}`}>
              {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
        </h3>
        <h3>Ptoduct: {ticket.product} </h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue:</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {ticket.status !== 'closed' && (
        <button 
          className='btn'
          onClick={openModal}
        >
          <FaPlus /> Add Note
        </button>
      )}

      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal} 
        style={customStyles}
        contentLabel='Add Note'
      >
        <h2>Add Note</h2>
        <button 
          className="btn-close"
          onClick={closeModal}
        > 
          X
        </button>

        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea 
              name="noteText" 
              id="noteText"
              className='form-control'
              placeholder='Note tex'
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type='submit'>Submit</button>
          </div>
        </form>
      </Modal>

      {notes.map( note => (
        <NoteItem key={note._id} note={note} />
      ))}

      {ticket.status !== 'closed' && (
        <button 
          className='btn btn-block btn-danger'
          onClick={onTicketClosed}
        >
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket