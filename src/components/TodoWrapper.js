import React, {useState} from 'react';
import { TodoForm } from './TodoForm';
import { Todo } from './Todo';
import { v4 as uuidv4 } from 'uuid';
import { EditTodoForm } from './EditTodoForm';
import { useEffect } from 'react';


uuidv4();

const ITEM_HEIGHT = 120; 
const MIN_TASKS_FOR_PAGINATION = 5;

export const TodoWrapper = () => {

  const [todos, setTodos] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    
    const availableHeight = window.innerHeight - 20; 
    setPageSize(Math.floor(availableHeight / ITEM_HEIGHT));
 
    window.addEventListener('resize', () => {
      setPageSize(Math.floor(availableHeight / ITEM_HEIGHT));
    });

    return () => window.removeEventListener('resize', () => {});
  }, []);

  const addTodo = todo => {
    setTodos([...todos, {id: uuidv4(), task: todo, completed: false, isEditing: false}])
    console.log(todos)
  }

  const toggleComplete = id => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo))
  }

  const deleteTodo = id => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = id => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, isEditing: !todo.isEditing}:todo))
  }

  const editTask = (task, id) => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, task, isEditing: !todo.isEditing} : todo))
  }

  const goToNextPage = () => {
    if (currentPage < Math.ceil(todos.length / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Show pagination buttons only when there are enough tasks and more than one page
  const showPagination = todos.length >= MIN_TASKS_FOR_PAGINATION && Math.ceil(todos.length / pageSize) > 1;

  return (
    <div className='TodoWrapper'>
      <h1>Get Thnings Done!</h1>
        <TodoForm addTodo={addTodo}/>


        {todos.slice(startIndex, endIndex).map((todo, index) => (
          todo.isEditing ? (
            <EditTodoForm editTodo={editTask} task={todo}/>
          ) : (
            <Todo task={todo} key={index} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo}/>
          )
          
        ))}

        {/* Conditionally render pagination buttons */}
        {showPagination && (
          <>
            <button className='PreviousBtn' onClick={goToPreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <button className='NextBtn' onClick={goToNextPage} disabled={currentPage === Math.ceil(todos.length / pageSize)}>
              Next
            </button>
          </>
        )}
        
    </div>
  )
}
