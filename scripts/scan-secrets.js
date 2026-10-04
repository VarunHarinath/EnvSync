// Deterministic release guard, not a substitute for provider-aware secret scanning.
import {execFileSync} from 'node:child_process';
import {readFileSync,statSync} from 'node:fs';
const files=execFileSync('git',['ls-files','-co','--exclude-standard','-z'],{maxBuffer:10*1024*1024}).toString().split('\0').filter(Boolean);
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bAKIA[A-Z0-9]{16}\b/,/\b(?:es|ea)_live_[A-Za-z0-9_-]{40,}\b/];
const failures=[];
for(const file of new Set(files)) {
  if(file.startsWith('artifacts/')||!statSync(file,{throwIfNoEntry:false})?.isFile())continue;
  if(/(^|\/)(runtime\.env|\.env(?:\..*)?)$/.test(file)&&!file.endsWith('.env.example'))failures.push(`${file}: configuration must not be tracked`);
  const text=readFileSync(file,'utf8');
  if(patterns.some(pattern=>pattern.test(text)))failures.push(`${file}: credential-shaped material (value redacted)`);
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('PASS working-tree credential-pattern scan. History, binary artifacts and unknown provider patterns require separate review.');
