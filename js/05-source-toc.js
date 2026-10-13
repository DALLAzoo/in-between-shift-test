
(function(){
 const out=document.getElementById('sourceTocList');if(!out)return;
 function render(source){const rows=source.split(/\r?\n/);const found=[];rows.forEach((line,i)=>{const m=line.match(/<!-- SECTION: ([^|]+) \| ([^\n]+?) -->/);if(m)found.push([i+1,m[1].trim(),m[2].trim()]);});if(!found.length)return;out.replaceChildren();found.forEach(([n,name,desc])=>{const li=document.createElement('li');li.textContent=`${name} — ${desc} (L${n})`;out.append(li);});}
 const embedded=Array.from(document.childNodes).filter(n=>n.nodeType===8).map(n=>n.nodeValue).join('\n');
 const fallback=embedded.match(/AUTO-GENERATED SOURCE INDEX:[\s\S]*?END SOURCE INDEX/);
 if(fallback){out.innerHTML='';fallback[0].split('\n').filter(x=>/L\d{4}/.test(x)).forEach(x=>{const li=document.createElement('li');li.textContent=x.replace(/^\s*<!--\s*|\s*-->\s*$/g,'');out.append(li);});}
 if(location.protocol==='http:'||location.protocol==='https:')fetch(location.href,{cache:'no-store'}).then(r=>r.ok?r.text():Promise.reject()).then(render).catch(()=>{});
})();
