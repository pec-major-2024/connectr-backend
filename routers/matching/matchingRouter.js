import { Router } from "express";
import Note from "../../models/Note.js";
import NoteEmotion from "../../models/NoteEmotion.js";
import Diary from "../../models/Diary.js";
import User from "../../models/User.js";

const matchingRouter = Router();

matchingRouter.route("/")
    .get(async (req, res) => {
        try {
            const noteId = req.query.noteId;
            const note = await Note.findOne({ _id: noteId }).exec();
            const noteEmotion = await NoteEmotion.findOne({ noteId: noteId }).exec();
            console.log("Fetching user's note, match and note emotion", note, noteEmotion)

            const matchedNoteId = note.match?.buddy;
            if (!matchedNoteId) {
                res.status(200).json({
                    note,
                    noteEmotion,
                });
            }

            const diary = await Diary.findOne({ notes: { $elemMatch: { $eq: matchedNoteId } } });
            const matchedUser = await User.findById(diary.user);
            res.status(200).json({
                note,
                noteEmotion,
                matchedUser,
            })
        } catch (err) {

        }
    })

export default matchingRouter;