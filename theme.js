const root = document.documentElement
const key = "vocalog-theme"

function applyTheme(t){
  root.setAttribute("data-theme", t)
  localStorage.setItem(key, t)
  const btn = document.getElementById("themeToggle")
  if(btn) btn.textContent = (t === "dark") ? "☀️" : "🌙"
}

applyTheme(localStorage.getItem(key) || "light")

document.addEventListener("click", (e)=>{
  if(e.target && e.target.id === "themeToggle"){
    const now = root.getAttribute("data-theme") || "light"
    applyTheme(now === "dark" ? "light" : "dark")
  }
})
