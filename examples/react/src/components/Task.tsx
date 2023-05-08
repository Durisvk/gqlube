import { useMutation, pick } from "@gqlube/react";
import React from "react";

type Props = {
  id: string;
  title: string;
  completed: boolean;

  onUpdate: (update: (data: any) => any) => void;
};

export const Task: React.FC<Props> = ({ id, title, completed, onUpdate }) => {
  const [execute] = useMutation();

  const setCompleted = (value: boolean) => {
    execute((q: any) =>
      pick(
        q.updateTask({
          [`id: ID!`]: id,
          [`completed: Boolean!`]: value,
        }),
        ["id", "completed"]
      )
    ).then((res: any) => {
      if (res.data) {
        onUpdate((data: any) => ({
          ...data,
          tasks: data.tasks.map((t: any) =>
            t.id === res.data.updateTask.id
              ? { ...t, ...res.data.updateTask }
              : t
          ),
        }));
      }
    });
  };

  return (
    <div className="task">
      <input
        id={`checkbox-${id}`}
        type="checkbox"
        checked={completed}
        onChange={(e) => setCompleted(e.target.checked)}
      />
      <label className={completed ? "checked" : ""} htmlFor={`checkbox-${id}`}>
        {title}
      </label>
    </div>
  );
};
