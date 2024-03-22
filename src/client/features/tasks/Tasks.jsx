import { useSelector } from "react-redux";
import { selectToken } from "../auth/authSlice";
import NewTask from "./NewTask";
import Task from "./Task";
import { useGetTasksQuery } from "./taskSlice";

import "./Tasks.less";
import store from "../../store";
import { useNavigate } from "react-router-dom";

/** Main interface for user to interact with their tasks */
export default function Tasks() {
  ///const token = useSelector(selectToken);
  const token = true;
  const { data: tasks, isLoading } = useGetTasksQuery();
  const navigate = useNavigate();

  if (!token) {
    return <p>You must be logged in to see your tasks.</p>;
  }

  return (
    <div className="tasks">
      <h1>Stores</h1>
      {data.map((s) => {
        return (
          <div>
            <h4> {s.name}</h4> <p>{s.address}</p>{" "}
            <p>average Review:{s.avgReview}</p>
            <button onClick={() => navigate("/review")}>add Review</button>
          </div>
        );
      })}
      <h2>Add store</h2>
      <NewTask />
      <h2>Your Tasks</h2>
      {isLoading && <p>Loading tasks...</p>}
      {tasks && (
        <ul>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </ul>
      )}
    </div>
  );
}
