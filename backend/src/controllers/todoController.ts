import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { TodoModel } from '../models/todoModel';

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const userTodos = await TodoModel.findByUser(userId);
    return res.json({ todos: userTodos });
  } catch (err) {
    console.error('Get todos error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { title } = req.body;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newTodo = await TodoModel.create({ userId, title });
    if (!newTodo) {
      return res.status(500).json({ error: 'Failed to create todo' });
    }

    return res.status(201).json({ todo: newTodo });
  } catch (err) {
    console.error('Create todo error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const todoId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
    const { title, completed } = req.body;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const updatedTodo = await TodoModel.update(todoId, userId, { title, completed });
    if (!updatedTodo) return res.status(404).json({ error: 'Todo not found' });

    return res.json({ todo: updatedTodo });
  } catch (err) {
    console.error('Update todo error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const todoId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const success = await TodoModel.delete(todoId, userId);
    if (!success) return res.status(404).json({ error: 'Todo not found' });

    return res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Delete todo error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};