import { db } from '../db';
import { todos } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export interface CreateTodoData {
  userId: number;
  title: string;
}

export interface UpdateTodoData {
  title?: string;
  completed?: boolean;
}

export const TodoModel = {
  findByUser: async (userId: number) => {
    return await db.select().from(todos).where(eq(todos.userId, userId));
  },

  findByIdAndUser: async (id: number, userId: number) => {
    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
    return todo || null;
  },

 create: async (data: CreateTodoData) => {
    
    const [result] = await db.insert(todos).values({
      userId: data.userId,
      title: data.title,
      completed: false,
    });

    
    const newTodoId = Number((result as any)?.insertId || 0);
    if (!newTodoId) return null;

    
    const [newTodo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, newTodoId), eq(todos.userId, data.userId)));

    return newTodo || null;
  },

  update: async (id: number, userId: number, data: UpdateTodoData) => {
    await db
      .update(todos)
      .set({
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.completed !== undefined ? { completed: data.completed } : {}),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    return await TodoModel.findByIdAndUser(id, userId);
  },

  delete: async (id: number, userId: number) => {
    const todo = await TodoModel.findByIdAndUser(id, userId);
    if (!todo) return false;

    await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
    return true;
  },
};