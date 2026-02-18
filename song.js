const content = document.getElementById("content")

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]))
}

function getId(){
  return new URLSearchParams(location.search).get("id")
}

Promise.all([
  fetch("./data/songs.json").then(r=>r.json()),
  fetch("./data/producers.json").then(r=>r.json()),
  fetch("./data/vocals.json").then(r=>r.json())
]).then(([songs, producers, vocals])=>{
  const id = getId()
  const s = songs.find(x=>x.id === id)

  if(!s){
    content.innerHTML = `<p>曲が見つからなかった</p>`
    return
  }

  const p = producers.find(x=>x.id === s.producerId)
  const v = vocals.find(x=>x.id === s.vocalId)

  const tags = (s.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")
  const links = `
    <div class="links">
      <a class="link" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${encodeURIComponent(s.youtubeId)}">YouTube</a>
      ${s.lyricsLink ? `<a class="link" target="_blank" rel="noopener" href="${s.lyricsLink}">歌詞</a>` : ""}
      ${s.streamingLink ? `<a class="link" target="_blank" rel="noopener" href="${s.streamingLink}">配信</a>` : ""}
      ${s.karaokeLink ? `<a class="link" target="_blank" rel="noopener" href="${s.karaokeLink}">カラオケ</a>` : ""}
    </div>
  `

  document.title = `${s.title} - VOCALOG`

  content.innerHTML = `
    <h2 class="title">${escapeHtml(s.title)}</h2>
    <p class="muted">
      ${p ? `<a class="link" href="./producer.html?id=${encodeURIComponent(p.id)}">${escapeHtml(p.name)}</a>` : "不明"}
      /
      ${v ? `<a class="link" href="./vocal.html?id=${encodeURIComponent(v.id)}">${escapeHtml(v.name)}</a>` : "不明"}
    </p>
    ${s.released ? `<p class="muted">🗓 ${escapeHtml(s.released)}</p>` : ""}
    ${s.summary ? `<p>${escapeHtml(s.summary)}</p>` : ""}
    ${links}
    <div class="tags">${tags}</div>
    <div style="margin-top:12px;">
      <iframe
        src="https://www.youtube.com/embed/${encodeURIComponent(s.youtubeId)}"
        title="${escapeHtml(s.title)}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>
  `
})
