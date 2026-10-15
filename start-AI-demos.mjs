import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const folder=path.dirname(fileURLToPath(import.meta.url));
const address='http://127.0.0.1:8787';
const noOpen=process.argv.includes('--no-open');
const major=Number(process.versions.node.split('.')[0]);
if(major<22){console.error('Use Node 22 or newer, then run this launcher again.');process.exit(1);}
async function health(){try{const r=await fetch(address+'/health',{signal:AbortSignal.timeout(700)});if(!r.ok)return null;const h=await r.json();return h.ok===true&&typeof h.configured==='boolean'&&typeof h.model==='string'?h:null;}catch{return null;}}
function openBrowser(){
 if(noOpen)return;
 const args=process.platform==='win32'
  ?['powershell.exe',['-NoProfile','-NonInteractive','-Command',`Start-Process -FilePath '${address}'`]]
  :process.platform==='darwin'?['open',[address]]:['xdg-open',[address]];
 const fallback=()=>console.log('Open '+address+' in your browser.');
 const p=spawn(args[0],args[1],{stdio:'ignore',detached:true,windowsHide:true});
 p.once('error',fallback);p.once('exit',code=>{if(code)fallback();});p.unref();
}
let state=await health();
if(state){
 const page=await fetch(address).then(r=>r.text()).catch(()=>'');
 if(!page.includes('AI talk demos')){console.error('An older demo server is using port 8787. Stop its window with Ctrl+C, then run this launcher again from the new folder.');process.exit(1);}
 if(!state.configured){console.error('An AI demo server is already running, but it has no key loaded. Stop that server with Ctrl+C, copy your existing .env into this folder, then run this launcher again.');process.exit(1);}
 console.log('Using the already running AI demo server at '+address+'. Leave its existing window open.');openBrowser();
}else{
 console.log('Starting AI demos. Keep this window open while you rehearse.');
 const child=spawn(process.execPath,[path.join(folder,'server.mjs')],{cwd:folder,env:{...process.env,PORT:'8787'},stdio:'inherit'});
 let ended=false;child.once('exit',()=>{ended=true;});
 for(let i=0;i<30&&!ended;i++){state=await health();if(state)break;await new Promise(r=>setTimeout(r,150));}
 if(!state){console.error('The server did not start. If port 8787 is already in use, stop the old server with Ctrl+C and run this launcher again.');child.kill();process.exitCode=1;}
 else if(!state.configured){console.error('Copy your existing private .env into this folder beside server.mjs, then run this launcher again. The package also includes .env.example.');child.kill();process.exitCode=1;}
 else{console.log('Server ready and API key loaded. Confirm a real request in each feature. Open '+address);openBrowser();}
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{child.kill(signal);});
}
