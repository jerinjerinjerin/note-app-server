import express from 'express';
import { 
    CreateNote, 
    DeleteNote, 
    EditNotes, 
    GetAllNotes, 
    SearchNotes, 
    UpdateNotePinned
} from '../controller/note.controller.js';
import { authenticateToken} from'../utillites.js'

const router = express.Router();

router.post('/create-note',authenticateToken, CreateNote)
router.put('/edit-note/:noteId', authenticateToken, EditNotes)
router.get('/get-all-notes', authenticateToken, GetAllNotes)
router.delete('/delete-note/:noteId', authenticateToken, DeleteNote)
router.put('/update-note-pinned/:noteId',authenticateToken, UpdateNotePinned)
router.get('/search-notes/', authenticateToken, SearchNotes)

export default router;