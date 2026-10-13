import { relations } from "drizzle-orm";
import { timestamp,int,varchar,boolean, mysqlTable } from "drizzle-orm/mysql-core";


export const users=mysqlTable("users",{
    id:int("id").autoincrement().primaryKey(),
    name:varchar("name",{length:255}).notNull(),
    email:varchar("email",{length:255}).notNull().unique(),
    password:varchar("password",{length:255}).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull()
});

export const todos=mysqlTable("todos",{
    id:int("id").autoincrement().primaryKey(),
    userId:int("user_id").notNull(),
    title:varchar("title",{length:255}).notNull(),
    completed:boolean("completed").default(false).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull(),
    updatedAt:timestamp("updated_at").defaultNow().notNull()
})

export const userRelations=relations(users,({many})=>({
    todos:many(todos)
}));

export const todoRelations=relations(todos,({one})=>({
    user:one(users,{
        fields:[todos.userId],
        references:[users.id]
    })
}))