import { escapeHtml, norm, qs, loadJson, headerHtml } from "./app.js"

document.getElementById("header").innerHTML = headerHtml("songs")

const q = qs("q")
const list = qs("list")
const count = qs("count")
const sortSel = qs("sort")
const tagSel = qs("tag")

let songs = []
let producers = new Map()
let vocals = new Map()

function buildTagOptions(){
  const set = new Set()
  for(const s of songs){
    for(const t of (s.tags || [])) set.add(t)
  }
  const tags = Array.from(set).sort((a,b)=>a.localeCompare(b,"ja"))
  for(const t of tags){
    const opt = document.createElement("option")
    opt.value = t
    opt.textContent = t
    tagSel.appendChild(opt)
  }
}

function sortSongs(items){
  const mode = sortSel.value
  const copy = [...items]
  if(mode === "az"){
    copy.sort((a,b)=> (a.title||"").localeCompare(b.title||"","ja"))
  }else if(mode === "old"){
    copy.sort((a,b)=> (a.released||"").localeCompare(b.released||""))
  }else{
    copy.sort((a,b)=> (b.released||"").localeCompare(a.released||""))
  }
  return copy
}

function card(s){
  const p = producers.get(s.producerId)?.name || "不明"
  const v = vocals.get(s.vocalId)?.name || "不明"
  const tags = (s.tags || []).slice(0,8).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")
  return `
    <a class="card cardLink" href="./song.html?id=${encodeURIComponent(s.id)}">
      <h2 class="title">${escapeHtml(s.title)}</h2>
      <p class="muted">${escapeHtml(p)} / ${escapeHtml(v)}</p>
      ${s.released ? `<p class="muted">🗓 ${escapeHtml(s.released)}</p>` : ""}
      ${s.summary ? `<p class="muted">${escapeHtml(s.summary)}</p>` : ""}
      <div class="tags">${tags}</div>
      <p class="muted">開く →</p>
    </a>
  `
}

function render(items){
  count.textContent = `${items.length} 件`
  list.innerHTML = items.map(card).join("")
}

function filter(){
  const word = norm(q.value.trim())
  const tag = tagSel.value

  let items = songs.filter(s=>{
    const p = producers.get(s.producerId)?.name || ""
    const v = vocals.get(s.vocalId)?.name || ""
    const target = norm(`${s.title} ${p} ${v} ${(s.tags||[]).join(" ")} ${s.released||""} ${s.summary||""}`)
    const hitWord = word ? target.includes(word) : true
    const hitTag = tag ? (s.tags||[]).includes(tag) : true
    return hitWord && hitTag
  })

  items = sortSongs(items)
  render(items)
}

async function main(){
  try{
    const [sData, pData, vData] = await Promise.all([
      loadJson("./data/songs.json"),
      loadJson("./data/producers.json"),
      loadJson("./data/vocals.json"),
    ])
    songs = sData
    producers = new Map(pData.map(p=>[p.id,p]))
    vocals = new Map(vData.map(v=>[v.id,v]))

    buildTagOptions()
    filter()
  }catch(err){
    document.body.innerHTML = `<div style="padding:16px;font-family:sans-serif;">読み込み失敗: ${escapeHtml(err.message)}</div>`
  }
}

main()
q.addEventListener("input", filter)
sortSel.addEventListener("change", filter)
tagSel.addEventListener("change", filter)
