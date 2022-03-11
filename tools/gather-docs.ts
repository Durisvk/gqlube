import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

execSync('mkdir -p docs');
const lernaLs = execSync('lerna ls', { encoding: 'utf-8' });

const packages = lernaLs.split('\n').filter((pckg) => !!pckg);

let index = `
## GQLube Packages:
`;

for (const pckg of packages) {
  const name = pckg.replace('@gqlube/', '');
  execSync(`cp -r packages/${name}/docs ./docs/${name}`);

  index += `\n### [@gqlube/${name}](./${name}/README.md)`;
}

writeFileSync('./docs/index.md', index);
