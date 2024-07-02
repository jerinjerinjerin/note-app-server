import { application } from "express";
import Note from "../models/note.model.js";

//create note end point

export const CreateNote = async (req, res, next) => {
  try {
    const { title, content, tags = [], isPinned = false } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Assuming `req.user` is populated by your authentication middleware
    const userId = req.user && req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const note = new Note({
      title,
      content,
      tags,
      isPinned,
      userId,
    });

    await note.save();

    return res.status(201).json({
      error: false,
      note,
      message: "Note created successfully",
    });
  } catch (error) {
    console.error("Error creating note:", error); // Log error for debugging
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

//edit note end point

export const EditNotes = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const { title, content, tags, isPinned } = req.body;

    const userId = req.user && req.user._id;

    if (!title && !content && !tags && typeof isPinned !== "boolean") {
      return res
        .status(400)
        .json({ error: true, message: "no Changes provided" });
    }

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ error: true, message: "notes not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.status(200).json({
      error: false,
      note,
      message: "Note updated successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

//get all notes end point

export const GetAllNotes = async (req, res) => {
  try {
    const userId = req.user && req.user._id;

    const notes = await Note.find({ userId });

    return res.status(200).json({
      error: false,
      notes,
      message: "Notes fetched successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "intianl server error" });
  }
};

//delete note endpoint

export const DeleteNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const userId = req.user && req.user._id;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ error: true, message: "notes not found" });
    }

    await note.deleteOne({ _id: noteId });

    return res.status(200).json({
      error: false,
      message: "Note deleted successful",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: true, message: "intianl server error" });
  }
};

//update note pinned end point

export const UpdateNotePinned = async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const userId = req.user && req.user._id;

  if (!noteId) {
    return res.status(400).json({
      error: true,
      message: "Note ID is required",
    });
  }

  if (typeof isPinned !== "boolean") {
    return res.status(400).json({
      error: true,
      message: "Invalid value for isPinned",
    });
  }

  if (!userId) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized",
    });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    note.isPinned = isPinned;
    await note.save();

    return res.json({
      error: false,
      message: "Note updated successfully",
      note
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

//search notes

export const SearchNotes = async (req, res) => {
  const user = req.user;

  const {query} = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrievid successfully",
    });
  } catch (error) {
    console.log(error)
    return res
      .status(400)
      .json({ error: true, message: "Internal Server Error" });
  }
};
