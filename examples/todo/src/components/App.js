import React from 'react'
import AddTodo from './AddTodo'
import Footer from './Footer'
import TodoList from '../containers/TodoList'

const App = () => (
  <div>
    <AddTodo/>
    <TodoList/>
    <Footer/>
  </div>
)

export default App
