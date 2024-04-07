import mongoose from "mongoose";
const { Schema } = mongoose;

//this is a basic struct of a note 

const noteSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    favourite: {
        type: Boolean,
        default: false
    },
    protect: {
        type: Boolean,
        default: false
    },
    date: { // timezone matches the client side 
        type: String,
        required: true
    },
    match: {
        type: {
            state: {
                type: String,
                enum: ['Initiated', 'Pending', 'Completed'],
                default: 'Initiated'
            },
            buddy: {
                type: Schema.Types.ObjectId,
                ref: 'Note',
                default: null,
            }
        },
        default: null,
        _id: false,
    }
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);
