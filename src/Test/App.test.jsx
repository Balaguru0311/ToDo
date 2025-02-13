import React from 'react';  
import { render, screen, fireEvent, waitFor } from '@testing-library/react';  
import { expect, test, describe } from 'vitest';
import App from "../App.jsx";  
import axios from 'axios';  
import MockAdapter from 'axios-mock-adapter';  

const mock = new MockAdapter(axios);  

describe('ToDo App', () => {  
  beforeEach(() => {  
    // Reset the mock before each test  
    mock.reset();  
  });  

  test('renders the Todo List heading', () => {  
    render(<App />);  
    const h1 = screen.getByText(/Todo List/i);  
    expect(h1).toBeInTheDocument();  
  });  

  test('fetches and displays todos', async () => {  
    mock.onGet('http://localhost:5000/api/todos').reply(200, [  
      { _id: '1', text: 'Todo 1' },  
      { _id: '2', text: 'Todo 2' },  
    ]);  

    render(<App />);  

    const todo1 = await screen.findByText(/Todo 1/i);  
    const todo2 = await screen.findByText(/Todo 2/i);  
    expect(todo1).toBeInTheDocument();  
    expect(todo2).toBeInTheDocument();  
  });  

  test('adds a new todo', async () => {  
    mock.onGet('http://localhost:5000/api/todos').reply(200, []);  
    mock.onPost('http://localhost:5000/api/todos').reply(201, { _id: '3', text: 'New Todo' });  

    render(<App />);  

    fireEvent.change(screen.getByPlaceholderText(/Add a new todo/i), { target: { value: 'New Todo' } });  
    fireEvent.click(screen.getByText(/Add Todo/i));  

    const newTodo = await screen.findByText(/New Todo/i);  
    expect(newTodo).toBeInTheDocument();  
  });  

  test('updates an existing todo', async () => {  
    mock.onGet('http://localhost:5000/api/todos').reply(200, [  
      { _id: '1', text: 'Todo 1' },  
    ]);  
    mock.onPut('http://localhost:5000/api/todos/1').reply(200, { _id: '1', text: 'Updated Todo' });  

    render(<App />);  

    // Wait for the initial todo to be displayed  
    const todo1 = await screen.findByText(/Todo 1/i);  
    expect(todo1).toBeInTheDocument();  

    // Click the Edit button  
    fireEvent.click(screen.getByText(/Edit/i));  
    fireEvent.change(screen.getByPlaceholderText(/Add a new todo/i), { target: { value: 'Updated Todo' } });  
    fireEvent.click(screen.getByText(/Update Todo/i));  

    const updatedTodo = await screen.findByText(/Updated Todo/i);  
    expect(updatedTodo).toBeInTheDocument();  
  });  

  test('deletes a todo', async () => {  
    mock.onGet('http://localhost:5000/api/todos').reply(200, [  
      { _id: '1', text: 'Todo 1' },  
    ]);  
    mock.onDelete('http://localhost:5000/api/todos/1').reply(204);  

    render(<App />);  

    const todo1 = await screen.findByText(/Todo 1/i);  
    expect(todo1).toBeInTheDocument();  

    // Click the Delete button  
    fireEvent.click(screen.getByText(/Delete/i));  

    await waitFor(() => {  
      expect(todo1).not.toBeInTheDocument();  
    });  
  });  
});