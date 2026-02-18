// theme.js
const root = document.documentElement
const key = "vocalog-theme"

function setIconByTheme(theme) {
  const btn = document.getElementById("themeToggle")
  if (!btn) return
  // ダーク中は「ライトに戻す」＝太陽
  btn.textContent = (theme === "dark") ? "☀️" : "🌙"
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme)
  localStorage.setItem(key, theme)
  setIconByTheme(theme)
}

// 初期テーマ適用
applyTheme(localStorage.getItem(key) || "light")

// クリックで切り替え（ボタンが後から出てもOK）
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "themeToggle") {
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
