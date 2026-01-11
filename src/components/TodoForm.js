import React, { useState } from 'react';


export const TodoForm = ({addTodo}) => {

    const [value, setValue] = useState("")

    const handleSubmit = e => {
      e.preventDefault();

      const trimmedValue = value.trim();

      if (trimmedValue === '') {
        alert('Please enter a task description');
        return; 
      }
  
      addTodo(trimmedValue);
  
      setValue('');
    }

  return (
    <form className='TodoForm' onSubmit={handleSubmit}>
        <input type='text' className='todo-input' value={value} placeholder='Todays Task' onChange={(e) => setValue(e.target.value)} />
        <button type='submit' className='todo-btn'>Add Task</button>
    </form>
  )
}
