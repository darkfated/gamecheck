;(function () {
  console.log("Инициализация Vue компонентов...")

  function initVueComponents() {
    if (typeof customElements !== "undefined") {
      if (!customElements.get("vue-game-widget")) {
        console.log(
          "Vue компонент не зарегистрирован, пробуем регистрировать вручную..."
        )

        if (window.VueGameWidget) {
          try {
            customElements.define("vue-game-widget", window.VueGameWidget)
            console.log("Регистрация vue-game-widget успешна!")
            return true
          } catch (e) {
            console.error("Ошибка при регистрации vue-game-widget:", e)
          }
        } else {
          console.warn("VueGameWidget недоступен в глобальном объекте window.")

          const script = document.createElement("script")
          script.src = "/js/vue-game-widget.umd.js"
          script.async = false
          script.onload = function () {
            console.log("Vue script reloaded successfully")

            setTimeout(initVueComponents, 200)
          }
          document.head.appendChild(script)
        }
      } else {
        console.log("vue-game-widget уже зарегистрирован")
        return true
      }
    }
    return false
  }

  if (!initVueComponents()) {
    let attempts = 0
    const maxAttempts = 5

    const checkInterval = setInterval(function () {
      attempts++
      console.log(
        `Повторная попытка инициализации Vue компонентов (${attempts}/${maxAttempts})...`
      )

      if (initVueComponents() || attempts >= maxAttempts) {
        clearInterval(checkInterval)

        if (attempts >= maxAttempts) {
          console.warn(
            "Достигнуто максимальное количество попыток инициализации Vue компонентов"
          )

          setTimeout(function () {
            try {
              const containers = document.querySelectorAll(".vue-container")
              if (containers.length > 0) {
                console.log(
                  `Найдено ${containers.length} контейнеров для Vue компонентов`
                )

                containers.forEach(container => {
                  const el = document.createElement("div")
                  el.innerHTML = `
                    <div style="padding: 20px; background: linear-gradient(to right, #4a2f80, #3a4780); color: white; border-radius: 8px; text-align: center;">
                      <h3 style="margin-bottom: 10px;">Game Score Tracker (Fallback)</h3>
                      <p>Vue компонент не удалось загрузить корректно.</p>
                    </div>
                  `
                  container.appendChild(el)
                })
              }
            } catch (e) {
              console.error("Ошибка при добавлении запасного элемента:", e)
            }
          }, 500)
        }
      }
    }, 1000)
  }

  window.addEventListener("load", function () {
    console.log("Страница загружена, проверяем Vue компоненты...")
    initVueComponents()
  })
})()
