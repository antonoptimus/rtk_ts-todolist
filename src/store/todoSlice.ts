import { AnyAction, PayloadAction, UnknownAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Todo = {
   id: string,
   title: string,
   completed: boolean
}

type TodosState = {
   list: Todo[],
   loading: boolean,
   error: string | null
}

export const fetchTodos = createAsyncThunk<Todo[], undefined, {rejectValue: string}>(
   'todos/fetchTodos',
   async function(_, {rejectWithValue}) {
           const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
           
           if (!response.ok) {
            return rejectWithValue('Server Error!');
           }
   
           const data = await response.json();
   
           return data;
   }
);

export const addNewTodo = createAsyncThunk<Todo, string, {rejectValue: string}>(
    "todos/deleteTodos",
    async function (title, { rejectWithValue }) {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: 1,
              title: title,
              completed: false,
            }),
          }
        );
  
        if (!response.ok) {
            return rejectWithValue("Something went wrong");
        }
  
        return await (response.json()) as Todo;
    }
  );

export const toggleStatus = createAsyncThunk<Todo, string, {rejectValue: string, state: {todos: TodosState}}>(
  "todos/toggleStatus",
  async function (id, { rejectWithValue, getState }) {
    const todo = getState().todos.list.find((todo) => todo.id === id);

        if (todo) {
            const response = await fetch(
              `https://jsonplaceholder.typicode.com/todos/${id}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  completed: !todo.completed,
                }),
              }
            );
      
            if (!response.ok) {
              return rejectWithValue("Something went wrong");
            }
      
            return await (response.json()) as Todo
        }

        return rejectWithValue('No such todo in the list')
  }
);

export const deleteTodos = createAsyncThunk<string, string, {rejectValue: string}>(
    "todos/deleteTodos",
    async function (id, { rejectWithValue }) {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/todos/${id}`,
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
            return rejectWithValue("Something went wrong");
        }

        return id;
    }
  );
  
  

const initialState: TodosState = {
   list: [],
   loading: false,
   error: null
}

const todoSlice = createSlice({
   name: 'todos',
   initialState,
   reducers: {}, 
   extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(addNewTodo.pending, (state) => {
        state.loading = true;
        state.error = null;        })
      .addCase(addNewTodo.fulfilled, (state, action) => {
          state.list.push(action.payload)
      })
      .addCase(toggleStatus.pending, (state) => {
        state.loading = true;
        state.error = null;        })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        const toggledTodo = state.list.find(todo => todo.id === action.payload.id);
        if (toggledTodo) {
            toggledTodo.completed = !toggledTodo.completed;
        }      
        })
      .addCase(deleteTodos.pending, (state) => {
        state.loading = true;
        state.error = null;        })
      .addCase(deleteTodos.fulfilled, (state, action) => {
          state.list = state.list.filter(todo => todo.id !== action.payload);
        })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload
        state.loading = false
      })
    }
});

function isError(action: AnyAction) {
    return action.type.endsWith('rejected')
}

export default todoSlice.reducer