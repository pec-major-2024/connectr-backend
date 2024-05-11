import { Router } from "express";
import Note from "../../models/Note.js";
import NoteEmotion from "../../models/NoteEmotion.js";

const matchingRouter = Router();

matchingRouter.route("/")
    .get( async (req, res) => {
        try {
            const noteId = req.query.noteId;
            const note = await Note.findOne({ _id: noteId }).exec();
            const noteEmotion = await NoteEmotion.findOne({ noteId: noteId }).exec();
            console.log("Fetching user's note, match and note emotion", note, noteEmotion)
            res.status(200).json({
                note,
                noteEmotion,
            });
        } catch (err) {
            
        }
    })

export default matchingRouter;