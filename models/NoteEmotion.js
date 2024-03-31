import mongoose from "mongoose";
const { Schema } = mongoose;

const NoteEmotion = new Schema({
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  emotion: {
    type: {
      anger: { type: Number, default: null },
      disgust: { type: Number, default: null },
      fear: { type: Number, default: null },
      joy: { type: Number, default: null },
      neutral: { type: Number, default: null },
      sadness: { type: Number, default: null },
      shame: { type: Number, default: null },
      surprise: { type: Number, default: null }
    },
    required: true
  },
  keywords: {
    type: [String],
    required: true
  }
});

export default mongoose.model('NoteEmotion', NoteEmotion);