const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/notes.json");
console.log(JSON.parse(fs.readFileSync(filePath)));

// Read the File Data ---> Internal Function
const getNotesFromFile = () => {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// Save data to the file ---> Internal Function
const saveNotesToFile = (notes) => {
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
};

// send all notes as JSON
exports.getNotes = (req, res) => {
  const notes = getNotesFromFile();
  res.json(notes);
};

// find by id
exports.getNoteById = (req, res) => {
  const noteId = req.params.id;
  const notes = getNotesFromFile();
  const note = notes.find((n) => n.id === noteId);
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
};

exports.createNote = (req, res) => {
  const notes = getNotesFromFile();

  const newNote = {
    id: Date.now().toString(), // Unique ID based on timestamp
    title: req.body.title, // From request body
    content: req.body.content,
  };

  notes.push(newNote); // Add to list
  saveNotesToFile(notes); // Save to file
  res.status(201).json(newNote); // Send response
};

exports.updateNote = (req, res) => {
  const notes = getNotesFromFile();
  const index = notes.findIndex((n) => n.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Note not found" });

  notes[index] = { ...notes[index], ...req.body };
  saveNotesToFile(notes);
  res.json(notes[index]);
};

exports.deleteNote = (req, res) => {
  let notes = getNotesFromFile();
  notes = notes.filter((n) => n.id !== req.params.id);
  saveNotesToFile(notes);
  res.json({ message: "Note deleted" });
};
