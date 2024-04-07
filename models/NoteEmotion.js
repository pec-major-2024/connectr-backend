import mongoose from "mongoose";
const { Schema } = mongoose;

const NoteEmotionSchema = new Schema({
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  emotion: {
    type: {
      anger: { type: Number, default: 0 },
      disgust: { type: Number, default: 0 },
      fear: { type: Number, default: 0 },
      joy: { type: Number, default: 0 },
      neutral: { type: Number, default: 0 },
      sadness: { type: Number, default: 0 },
      shame: { type: Number, default: 0 },
      surprise: { type: Number, default: 0 }
    },
    required: true,
    _id: false,
  },
  keywords: {
    type: [String],
    required: true
  }
});

const NoteEmotion = mongoose.model('NoteEmotion', NoteEmotionSchema);
export default NoteEmotion;