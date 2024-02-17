import { useEffect, useState } from "react";
import { useAppDispatch } from "./hook";

import NewTodoForm from "./components/NewTodoForm";
import TodoList from "./components/TodoList";
import { addNewTodo, fetchTodos } from "./store/todoSlice";

import "./App.css";

function App() {
  const [text, setText] = useState("");
  const dispatch = useAppDispatch();

  const handleAction = () => {
    if (text.trim().length) {
      dispatch(addNewTodo(text));
      setText("");
    }
  };

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  return (
    <div className="App">
      <NewTodoForm
        value={text}
        updateText={setText}
        handleAction={handleAction}
      />
      <TodoList />
    </div>
  );
}

export default App;
