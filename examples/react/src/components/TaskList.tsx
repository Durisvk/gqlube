import React from "react";
import { Task } from "./Task";
import { useMutation, pick } from "@gqlube/react";

type Props = {
  tasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];

  onUpdate: (update: (data: any) => any) => void;
};

export const TaskList: React.FC<Props> = ({ tasks, onUpdate }) => {
  const [execute] = useMutation<any>();
  const [title, setTitle] = React.useState("");

  return (
    <div className="task-list">
      <div className="task-list-header">
        <input
          type="text"
          id="add-task"
          placeholder="Add new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              execute((q: any) =>
                pick(q.createTask({ [`title: String!`]: title }), [
                  "id",
                  "title",
                  "completed",
                ])
              ).then((res: any) => {
                if (res?.data) {
                  onUpdate((data: any) => ({
                    ...data,
                    tasks: [...data.tasks, (res.data as any).createTask],
                  }));
                  setTitle("");
                }
              });
              return false;
            }
          }}
        />
      </div>
      <div className="task-list-body">
        {tasks.map((t) => (
          <Task
            key={t.id}
            id={t.id}
            title={t.title}
            completed={t.completed}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};
