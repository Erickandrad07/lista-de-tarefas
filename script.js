const KEY='erick-taskflow-v1';
const $ = (selector) => document.querySelector(selector);
let tasks=[];let filter='all';
try { const saved=JSON.parse(localStorage.getItem(KEY) || '[]'); tasks=Array.isArray(saved)?saved.filter(t=>t&&typeof t.text==='string'&&typeof t.done==='boolean'):[]; } catch { tasks=[]; }
function save(){try{localStorage.setItem(KEY,JSON.stringify(tasks));}catch{$('#status').textContent='Não foi possível salvar neste navegador.';}}
function render(){const list=$('#tasks');list.replaceChildren();const visible=tasks.filter(t=>filter==='all'||(filter==='done'?t.done:!t.done));
if(!visible.length){const li=document.createElement('li');li.className='empty';li.textContent=filter==='all'?'Nenhuma tarefa ainda. Adicione a primeira!':'Nenhuma tarefa neste filtro.';list.append(li);}
for(const task of visible){const li=document.createElement('li');li.className='task'+(task.done?' done':'');const check=document.createElement('input');check.type='checkbox';check.className='check';check.checked=task.done;check.setAttribute('aria-label','Concluir '+task.text);check.addEventListener('change',()=>{task.done=check.checked;save();render();});const span=document.createElement('span');span.className='task-text';span.textContent=task.text;const btn=document.createElement('button');btn.type='button';btn.className='danger';btn.textContent='Excluir';btn.setAttribute('aria-label','Excluir '+task.text);btn.addEventListener('click',()=>{tasks=tasks.filter(t=>t.id!==task.id);save();render();});li.append(check,span,btn);list.append(li);}
$('#counter').textContent=`${tasks.filter(t=>t.done).length} de ${tasks.length} concluídas`;
document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter));});}
$('#form').addEventListener('submit',e=>{e.preventDefault();const input=$('#task-input');const text=input.value.trim();if(!text)return;tasks.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),text,done:false});input.value='';$('#status').textContent='Tarefa adicionada!';save();render();input.focus();});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;render();}));
$('#clear-done').addEventListener('click',()=>{const n=tasks.length;tasks=tasks.filter(t=>!t.done);$('#status').textContent=n===tasks.length?'Não há tarefas concluídas.':'Tarefas concluídas removidas.';save();render();});render();
