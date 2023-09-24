import { TodosAccess } from './todosAcess'
import { fileStogare } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { createTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
export function createTodo(toDo: createTodoRequest, userId: any) {
    const toDoId = uuid.v4();
    const requestTodo = {
        
    }
}

export function deleteTodo(toDo: createTodoRequest, userId: any) {
    const toDoId = uuid.v4();
    const requestTodo = {
        
    }
}