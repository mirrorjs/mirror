import mirror, {connect} from 'mirrorx'
import TodoList from '../components/TodoList'

let nextId = 0

mirror.model({
  name: 'todos',
  initialState: {
    list: [],
    visibility: 'all'
  },
  reducers: {
    add(state, text) {
      return {
        ...state,
        list: [
          ...state.list,
          {id: nextId++, text}
        ]
      }
    },
    toggle(state, id) {
      return {
        ...state,
        list: state.list.map(d => {
          if (d.id === id) {
            d.completed = !d.completed
          }
          return d
        })
      }
    },
    setVisibility(state, filter) {
      return {
        ...state,
        visibility: filter
      }
    }
  }
})

export default connect(({todos}) => {
  return {
    todos: getVisibleTodos(todos.list, todos.visibility)
  }
})(TodoList)

function getVisibleTodos(todos, filter) {
  switch (filter) {
    case 'all':
      return todos
    case 'completed':
      return todos.filter(t => t.completed)
    case 'active':
      return todos.filter(t => !t.completed)
  }
}
