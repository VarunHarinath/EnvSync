import {readFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {tmpdir} from 'node:os';
const directory=path.resolve(process.argv[2]||'.');
if(!path.basename(directory).startsWith('envsync-release-')||path.dirname(directory)!==path.resolve(tmpdir()))throw new Error('Only an explicit EnvSync release-test directory is allowed');
for(const profile of ['personal','business','personal-recovered','business-recovered']){
  if(!(await readdir(directory)).includes(profile))continue;
  const instance=path.join(directory,profile);
  const config=JSON.parse(await readFile(path.join(instance,'instance.json'),'utf8'));
  if(!/^envsync-[a-f0-9]{12}$/.test(config.projectName))throw new Error('Unexpected test project');
  const result=spawnSync(process.execPath,['--input-type=module','-e',`const {load,compose}=await import(${JSON.stringify(new URL('../cli/lib/runtime.js',import.meta.url).href)});await compose(await load(),['down']);`],{env:{...process.env,ENVSYNC_HOME:instance},stdio:'pipe'});
  if(result.status!==0)throw new Error('Test cleanup failed; no volume deletion was requested');
  console.log(`Removed test containers/networks for ${config.projectName}; database volume preserved.`);
}
