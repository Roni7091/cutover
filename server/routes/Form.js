
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();


app.use(bodyParser.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/cutover?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const taskSchema = new mongoose.Schema({
  taskId: String,
  taskName: String,
  assignedTo: String,
  priority: String,
  dueDate: Date,
  completion: Number,
});


const Task = mongoose.model('Task', taskSchema);


app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
