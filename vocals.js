import { escapeHtml, norm, qs, loadJson, headerHtml } from "./app.js"

document.getElementById("header").innerHTML = headerHtml("vocals")

const q = qs("q")
const list = qs("list")
const count = qs("count")

let vocals = []

function render(items){
  count.textContent = `${items.length} 件`
  list.innerHTML = items.map(v=>`
    <a class="card cardLink" href="./vocal.html?id=${encodeURIComponent(v.id)}">
      <h2 class="title">${escapeHtml(v.name)}</h2>
      <p class="muted">${escapeHtml(v.engine || "")}</p>
      ${v.summary ? `<p class="muted">${escapeHtml(v.summary)}</p>` : `<p class="muted">詳細を見る →</p>`}
    </a>
  `).join("")
}

function filter(){
  const word = norm(q.value.trim())
  const items = vocals
    .filter(v=>{
      const target = norm(`${v.name} ${v.engine||""} ${v.summary||""}`)
      return word ? target.includes(word) : true
    })
    .sort((a,b)=> (a.name||"").localeCompare(b.name||"","ja"))
  render(items)
}

async function main(){
  try{
    vocals = await loadJson("./data/vocals.json")
    filter()
  }catch(err){
    document.body.innerHTML = `<div style="padding:16px;font-family:sans-serif;">読み込み失敗: ${escapeHtml(err.message)}</div>`
  }
}
main()
q.addEventListener("input", filter)
