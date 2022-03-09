import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

execSync('mkdir -p docs');
const lernaLs = execSync('lerna ls', { encoding: 'utf-8' });

const packages = lernaLs.split('\n').filter((pckg) => !!pckg);

let index = '';

for (const pckg of packages) {
  const name = pckg.replace('@gqlube/', '');
  execSync(`cp -r packages/${name}/docs ./docs/${name}`);

  index += `<a href="/${name}">${pckg}</a>`;
}

writeFileSync('./docs/index.html', index);
