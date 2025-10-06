import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function TodoList({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: true });
    if (error) console.error(error);
    else setTodos(data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: newTodo, user_id: user.id, is_done: false }])
      .select();
    if (error) console.error(error);
    else setTodos([...todos, ...data]);
    setNewTodo("");
  };

  const toggleTodo = async (id, status) => {
    const { error } = await supabase
      .from("todos")
      .update({ is_done: !status })
      .eq("id", id);
    if (!error) fetchTodos();
  };

  const deleteTodo = async (id) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (!error) fetchTodos();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-10">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img
              src={user.user_metadata.avatar_url || "https://via.placeholder.com/40"}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-xl font-bold">
              {user.user_metadata.full_name || user.email}
            </h2>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            className="flex-1 p-2 rounded text-black"
            placeholder="Add new todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="ml-2 bg-green-600 px-3 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>

        <ul>
          {todos.map((t) => (
            <li
              key={t.id}
              className={`flex justify-between items-center mb-2 p-2 rounded ${
                t.is_done ? "line-through bg-gray-700" : "bg-gray-600"
              }`}
            >
              <span onClick={() => toggleTodo(t.id, t.is_done)} className="cursor-pointer">
                {t.title}
              </span>
              <button onClick={() => deleteTodo(t.id)} className="text-red-500 font-bold">
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
