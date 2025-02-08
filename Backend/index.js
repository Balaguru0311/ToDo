const express = require('express');  
const mongoose = require('mongoose');  
const cors = require('cors');  
require('dotenv').config();  

const app = express();  
const PORT = process.env.PORT || 5000;  

app.use(cors());  
app.use(express.json());  

// Connect to MongoDB  
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo', {  
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
})
.then(() => {  
    console.log("Successfully connected to MongoDB.");  
})  
.catch(err => {  
    console.error("Error connecting to MongoDB:", err);  
});  

const TodoSchema = new mongoose.Schema({ text: String });  
const Todo = mongoose.model('Todo', TodoSchema);  

// Routes  
app.get('/api/todos', async (req, res) => {  
    const todos = await Todo.find();  
    res.json(todos);  
});  

app.post('/api/todos', async (req, res) => {  
    const newTodo = new Todo({ text: req.body.text });  
    await newTodo.save();  
    res.json(newTodo);  
});

app.put('/api/todos/:id', async (req, res) => {  
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { text: req.body.text }, { new: true });  
    if (!updatedTodo) {  
        return res.status(404).send("Todo not found");  
    }  
    res.json(updatedTodo);  
});  

// Delete a todo by ID  
app.delete('/api/todos/:id', async (req, res) => {  
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);  
    if (!deletedTodo) {  
        return res.status(404).send("Todo not found");  
    }  
    res.status(204).send();  // No Content  
});  
app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});