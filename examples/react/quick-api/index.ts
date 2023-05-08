import { ApolloServer } from "apollo-server";

const schema = /* GraphQL */ `
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }

  input TaskFilterInput {
    completed: Boolean
  }

  type Query {
    tasks(filter: TaskFilterInput): [Task]
    task(id: ID!): Task
  }

  type Mutation {
    createTask(title: String!): Task
    updateTask(id: ID!, title: String, completed: Boolean): Task
    deleteTask(id: ID!): Task
  }
`;

const tasks = [
  { id: "1", title: "Buy milk", completed: false },
  { id: "2", title: "Buy eggs", completed: false },
];

const resolvers = {
  Query: {
    tasks: (_: any, { filter }: any) => {
      return filter
        ? tasks.filter((task) => task.completed === filter.completed)
        : tasks;
    },
    task: (_: any, { id }: any) => tasks.find((task) => task.id === id),
  },
  Mutation: {
    createTask: (_: any, { title }: any) => {
      const task = { id: String(tasks.length + 1), title, completed: false };
      tasks.push(task);
      return task;
    },

    updateTask: (_: any, { id, title, completed }: any) => {
      const task = tasks.find((task) => task.id === id);
      if (!task) return null;

      task.title = title ?? task.title;
      task.completed = completed ?? task.completed;
      return task;
    },

    deleteTask: (_: any, { id }: any) => {
      const taskIndex = tasks.findIndex((task) => task.id === id);
      if (taskIndex === -1) return null;

      const task = tasks[taskIndex];
      tasks.splice(taskIndex, 1);
      return task;
    },
  },
};

const server = new ApolloServer({ typeDefs: schema, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
