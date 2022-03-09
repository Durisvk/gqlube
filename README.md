<div align="center">

# GQLube

</div>

<div align="center" style="background-color: red; font-size: 14px; color: #fff; padding: 4px">
THIS PACKAGE IS UNDER HEAVY DEVELOPMENT
</div>
<br />

Please do not use it yet, rather help with contribution! Your engineering excellence is heavily needed (durisvk2@gmail.com)

<br />

<p align="center">
    <a href="https://www.npmjs.com/package/@gqlube/core"><img alt="v7 npm Downloads" src="https://img.shields.io/npm/dm/@gqlube/core.svg?maxAge=43200&label=v7%20downloads"></a>
</p>

<p align="center">
  <a href="https://github.com/Durisvk/gqlube/actions/workflows/lint.yml"><img alt="GitHub CI Lint Status" src="https://github.com/Durisvk/gqlube/actions/workflows/lint.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/Durisvk/gqlube/actions/workflows/test.yml"><img alt="GitHub CI Test Status" src="https://github.com/Durisvk/gqlube/actions/workflows/test.yml/badge.svg?branch=main"></a>
  <a href="https://github.com/Durisvk/gqlube/actions/workflows/publish.yml"><img alt="GitHub CI Publish Status" src="https://github.com/Durisvk/gqlube/actions/workflows/publish.yml/badge.svg?branch=main"></a>
</p>

> <br />
> Put a little lube onto your GraphQL workflow.
> <br />

<br />

#### Imagine the good old workflow:

1. Prepare a schema

2. Write your queries & mutations

3. Use your queries & mutations

#### Now close your eyes and imagine the future of your workflow:

1. Prepare a schema

2. Use your schema

<br />

#### Aaaaand ...dumroll... Bam! That's in essence what GQLube is all about.

<br />

---

## Where to go next

... TODO ...

<br />

## What I want to achieve

```tsx
import { useQuery } from '@gqlube/react';

const MyReactComponent = () => {
  const q = useQuery();

  return (
    <div>
      <h1>Users with Posts</h1>
      <div>
        {q.users({ 'filter: FilterInput': { status: 'ACTIVE' } }).map((user) => (
          <div>
            {user.firstName} {user.lastName}
            <div>
              {user.posts.map((post) => (
                <a href={post.url}>{`${post.title} - ${post.createdAt}`}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```
