const q = document.getElementById("q")
const list = document.getElementById("list")
const count = document.getElementById("count")
const sortSel = document.getElementById("sort")
const tagSel = document.getElementById("tag")

let songs = []
let producers = new Map()
let vocals = new Map()

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]))
}

function norm(s){ return String(s || "").toLowerCase() }

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
  const p = producers.get(s.producerId)?.name || ""
  const v = vocals.get(s.vocalId)?.name || ""
  const tags = (s.tags || []).slice(0,6).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")
  const summary = s.summary ? `<p class="muted">${escapeHtml(s.summary)}</p>` : ""
  const released = s.released ? `<p class="muted">🗓 ${escapeHtml(s.released)}</p>` : ""
  return `
    <a class="card cardLink" href="./song.html?id=${encodeURIComponent(s.id)}">
      <h2 class="title">${escapeHtml(s.title)}</h2>
      <p class="muted">${escapeHtml(p)} / ${escapeHtml(v)}</p>
      ${released}
      ${summary}
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

Promise.all([
  fetch("./data/songs.json").then(r=>r.json()),
  fetch("./data/producers.json").then(r=>r.json()),
  fetch("./data/vocals.json").then(r=>r.json())
]).then(([sData, pData, vData])=>{
  songs = sData
  producers = new Map(pData.map(p=>[p.id,p]))
  vocals = new Map(vData.map(v=>[v.id,v]))

  buildTagOptions()
  filter()
})

q.addEventListener("input", filter)
sortSel.addEventListener("change", filter)
tagSel.addEventListener("change", filter)
