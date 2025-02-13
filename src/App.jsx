import { useState, useEffect } from 'react';  
import axios from 'axios';  

const App = () => {  
    const [todos, setTodos] = useState([]);  
    const [newText, setNewText] = useState('');  
    const [updateId, setUpdateId] = useState(null); // To track which todo is being updated  

    
    useEffect(() => {  
        // Fetch the initial todos from the backend  
        const fetchTodos = async () => {  
            const response = await axios.get('http://localhost:5000/api/todos');  
            setTodos(response.data);  
        };  
        
        fetchTodos();  
    }, []);  

    const handleAdd = async () => {  
        if (newText.trim() === '') return; // Prevent adding empty todos  
        try {  
            const response = await axios.post('http://localhost:5000/api/todos', { text: newText });  
            setTodos([...todos, response.data]); // Add the new todo to the state  
            setNewText(''); // Clear input field  
        } catch (error) {  
            console.error('Error adding todo:', error);  
        }  
    };  

    const handleUpdate = async () => {  
        if (updateId && newText.trim() !== '') {  
            try {  
                const response = await axios.put(`http://localhost:5000/api/todos/${updateId}`, { text: newText });  
                setTodos(todos.map(todo => (todo._id === updateId ? response.data : todo)));  
                setNewText(''); // Clear the input field after update  
                setUpdateId(null); // Reset updateId  
            } catch (error) {  
                console.error('Error updating todo:', error);  
            }  
        }  
    };  

    const handleDelete = async (id) => {  
        try {  
            await axios.delete(`http://localhost:5000/api/todos/${id}`);  
            setTodos(todos.filter(todo => todo._id !== id)); // Remove the deleted todo from state  
        } catch (error) {  
            console.error('Error deleting todo:', error);  
        }  
    };  
    
    return (  
        <div>  
            <h1>Todo List</h1>  
            <input  
                type="text"  
                placeholder="Add a new todo"  
                value={newText}  
                onChange={(e) => setNewText(e.target.value)}  
            />  
            
            {updateId ? (    
                <button onClick={handleUpdate}>Update Todo</button>  
                ):
            <button onClick={handleAdd}>Add Todo</button>}
             
            {todos.map(todo => (  
                <div key={todo._id}>  
                    <span>{todo.text}</span>  
                    <button onClick={() => {  
                        setNewText(todo.text); // Set the current text into input for editing  
                        setUpdateId(todo._id); // Set the id of the todo being updated  
                    }}>Edit</button> 
                    <button onClick={() => handleDelete(todo._id)}>Delete</button> 
                </div>  
            ))}  
              
        </div>  
    );  
};  

export default App;