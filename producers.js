import { escapeHtml, norm, qs, loadJson, headerHtml } from "./app.js"

document.getElementById("header").innerHTML = headerHtml("producers")

const q = qs("q")
const list = qs("list")
const count = qs("count")

let producers = []

function render(items){
  count.textContent = `${items.length} 人`
  list.innerHTML = items.map(p=>`
    <a class="card cardLink" href="./producer.html?id=${encodeURIComponent(p.id)}">
      <h2 class="title">${escapeHtml(p.name)}</h2>
      ${p.summary ? `<p class="muted">${escapeHtml(p.summary)}</p>` : `<p class="muted">詳細を見る →</p>`}
    </a>
  `).join("")
}

function filter(){
  const word = norm(q.value.trim())
  const items = producers
    .filter(p=>{
      const target = norm(`${p.name} ${(p.aliases||[]).join(" ")} ${p.activeYears||""} ${p.summary||""}`)
      return word ? target.includes(word) : true
    })
    .sort((a,b)=> (a.name||"").localeCompare(b.name||"","ja"))
  render(items)
}

async function main(){
  try{
    producers = await loadJson("./data/producers.json")
    filter()
  }catch(err){
    document.body.innerHTML = `<div style="padding:16px;font-family:sans-serif;">読み込み失敗: ${escapeHtml(err.message)}</div>`
  }
}
main()
q.addEventListener("input", filter)
