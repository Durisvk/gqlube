import React, { useCallback } from "react";
import "./App.css";
import { useQuery } from "@gqlube/react";
import { TaskList } from "./components/TaskList";

const App: React.FC = () => {
  const [r, q, controls] = useQuery<any>();
  const tasks = q.tasks;

  const onUpdate = useCallback(
    (update: (data: any) => any) => {
      controls.updateData(update);
    },
    [controls]
  );

  return r(
    <div className="App">
      <div>
        <TaskList onUpdate={onUpdate} tasks={tasks} />
      </div>
    </div>,
    { loadingFallback: <div>loading</div>, errorFallback: <div>error</div> }
  );
};

export default App;
