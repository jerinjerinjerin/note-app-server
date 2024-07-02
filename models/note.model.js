import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, required: true },
    userId: { type: String, required: true },
    createdOn: { type: Date, default: () => new Date() }
}, {
    versionKey: false,
    timestamps: true
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
