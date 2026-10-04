// Local-only, redacted pattern scan. No repository content leaves this process.
import {execFileSync} from 'node:child_process';
const revisions=execFileSync('git',['rev-list','--all'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const expression='(sk|rk)_(live|test)_[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----';
let findings=0;
for(const revision of revisions){
  try {
    const paths=execFileSync('git',['grep','-IlE',expression,revision,'--','.'],{encoding:'utf8',maxBuffer:1048576}).trim();
    if(paths){console.error(paths);findings++;}
  }catch(error){if(error.status!==1)throw new Error('History scan failed; result is unverified.');}
}
console.log(`Scanned ${revisions.length} reachable commits using local credential patterns. Values redacted; provider-aware and binary scanning remain separate checks.`);
if(findings)process.exitCode=1;
