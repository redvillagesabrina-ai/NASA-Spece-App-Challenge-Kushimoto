
const COLORS=["#2f6f5e","#c9822b","#4a6fa5","#a64f6b","#6b8e3d","#7a5aa8","#3c8c99","#b4542d"];
let items=[
  {name:"Development and research costs",pct:40},
  {name:"Launch cost",pct:30},
  {name:"Operations and scientific analysis costs",pct:20},
];
let seq=items.length;

const $=id=>document.getElementById(id);
let budget = 0;
const total = () => budget;
const mode=()=>document.querySelector('input[name=mode]:checked').value;
const sum=(except=-1)=>items.reduce((s,it,i)=>i===except?s:s+it.pct,0);
const r1=v=>Math.round(v*10)/10;
const fmt=v=>v.toLocaleString("ja-JP",{maximumFractionDigits:2});
const fmtShort = v =>
  v >= 1e9 ? (v / 1e9).toFixed(2) + "B" :
  v >= 1e6 ? (v / 1e6).toFixed(1) + "M" :
  fmt(v);

function setPct(i,v){
  v=Math.min(100,Math.max(0,r1(v)));
  if(mode()==="cap"){
    v=Math.min(v,r1(100-sum(i)));
  }else{
    let over=r1(sum(i)+v-100);
    if(over>0){
      const others=sum(i);
      items.forEach((it,j)=>{ if(j!==i) it.pct=r1(it.pct-over*(it.pct/others)); });
      // rounding cleanup
      let diff=r1(sum(i)+v-100);
      for(let j=items.length-1;diff>0&&j>=0;j--){
        if(j===i)continue;
        const d=Math.min(diff,items[j].pct); items[j].pct=r1(items[j].pct-d); diff=r1(diff-d);
      }
    }
  }
  items[i].pct=Math.max(0,v);
}

function render(){
  const list=$("list"); list.innerHTML="";
  items.forEach((it,i)=>{
    const c=COLORS[i%COLORS.length];
    const row=document.createElement("div"); row.className="row";
    row.innerHTML=`
      <div class="row-head">
        <span class="dot" style="background:${c}"></span>
        <input type="text" value="" aria-label="Item">
        <input type="number" class="pct" min="0" max="100" step="0.1" aria-label="Proportion">%
        <span class="amt"></span>
        <button class="del" title="Delete" aria-label="Delete">×</button>
      </div>
      <input type="range" min="0" max="100" step="0.1" aria-label="Percentage slider">`;
    const [name,pct]=row.querySelectorAll("input[type=text],input[type=number]");
    const range=row.querySelector("input[type=range]");
    name.value=it.name; pct.value=it.pct; range.value=it.pct;
    name.oninput=()=>{it.name=name.value};
    range.oninput=()=>{setPct(i,parseFloat(range.value)); update();};
    pct.onchange=()=>{setPct(i,parseFloat(pct.value)||0); update();};
    row.querySelector(".del").onclick=()=>{items.splice(i,1); render();};
    list.appendChild(row);
  });
  if(!items.length) list.innerHTML='<p class="note" style="margin:0">There are no items.Please add it with 「+ Add Item」.</p>';
  update();
}

function update(){
  const T=total(), used=r1(sum()), rem=r1(100-used);
  document.querySelectorAll("#list .row").forEach((row,i)=>{
    const it=items[i];
    row.querySelector(".pct").value=it.pct;
    row.querySelector("input[type=range]").value=it.pct;
    row.querySelector(".amt").textContent = "$" + fmtShort(T*it.pct/100);
  });
  $("bar").innerHTML=items.map((it,i)=>`<div style="width:${it.pct}%;background:${COLORS[i%COLORS.length]}"></div>`).join("");
  $("used").textContent=`use ${used}%`;
  const remEl=$("rem");
  remEl.textContent= rem<=0 ? "total 100%" : `left ${rem}%`;
  remEl.classList.toggle("full",rem<=0);
}

$("even").onclick = () => {
  if (!items.length) return;
  const base = Math.floor(1000 / items.length) / 10;
  items.forEach(it => it.pct = base);
  items[items.length - 1].pct = r1(100 - base * (items.length - 1));
  update();
};

random=Math.random()*5
random=Math.floor(random)
const budgetlist=[919000000,948100000,330600000,22900000,4316000000]
if(budgetlist[random]==919000000){
$('project').textContent="Mars exploration mission"
$('gazou').src="https://www.nasa.gov/wp-content/uploads/2025/09/perseverance-selfie.jpeg?w=1600"}
if(budgetlist[random]==948100000){
$('project').textContent="Satellite Launch Project"
$('gazou').src="https://www.nasa.gov/wp-content/uploads/2023/04/sls-on-the-launch-pad.jpg?w=1920"}
if(budgetlist[random]==330600000){
$('project').textContent="Asteroid Impact Avoidance Plan"
$('gazou').src="https://www.nasa.gov/wp-content/uploads/2023/10/1-pia24834.jpg?w=2048"}
if(budgetlist[random]==22900000){
$('project').textContent="Solar power project on the Moon"
$('gazou').src="https://plus.nasa.gov/wp-content/uploads/2025/12/moonbound-key-art-r4-op-c-horizontal-program-tile-16-9-without-title.jpg"}
if(budgetlist[random]==4316000000){
$('project').textContent="Next-generation space telescope development"
$('gazou').src="https://images-assets.nasa.gov/image/KSC-20260626-PH-SER01_0007/KSC-20260626-PH-SER01_0007~large.jpg?w=900&h=900&fit=clip&crop=faces%2Cfocalpoint"}
budget = budgetlist[random];
$('total').value = "$" + fmtShort(budget);
$("reset").onclick=()=>{items.forEach(it=>it.pct=0); update();};
$("copy").onclick=async()=>{
  const T=total();
  const text=items.map(it=>`${it.name}\t${it.pct}%\t${fmt(T*it.pct/100)}`).join("\n")+`\ntotal\t${r1(sum())}%\t${fmt(T*sum()/100)}`;
  try{await navigator.clipboard.writeText(text); $("msg").textContent="It has been translated";}
  catch{ $("msg").textContent="Couldn't copy"; }
  setTimeout(()=>$("msg").textContent="",2000);
};
render();
document.getElementById("result").addEventListener("click", () => {
  const T = total();
  const rows = document.querySelectorAll("#list .row");
  const list = [...rows].map(row => {
    const name = row.querySelector('input[type=text]').value;   
    const pct  = parseFloat(row.querySelector(".pct").value) || 0; 
    return { name: name, pct: pct, amount: T * pct / 100 };      
  });
  const project = document.getElementById("project").textContent;

  const data = { project: project, total: T, items: list };
  location.href = "launch.html?data=" + encodeURIComponent(JSON.stringify(data));
});