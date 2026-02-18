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

// ヘッダーが後から生成されるので、出現した瞬間にアイコンを同期
const observer = new MutationObserver(() => {
  const theme = root.getAttribute("data-theme") || "light"
  setIconByTheme(theme)
})

observer.observe(document.documentElement, { childList: true, subtree: true })

// 念のためDOM完成でも同期
document.addEventListener("DOMContentLoaded", () => {
  const theme = root.getAttribute("data-theme") || "light"
  setIconByTheme(theme)
})
