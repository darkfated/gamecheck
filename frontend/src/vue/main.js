import { createApp } from "vue"
import GameQuizComponent from "./components/GameQuiz.vue"

const mountVueApp = elementId => {
  const element = document.getElementById(elementId)
  if (element) {
    const app = createApp(GameQuizComponent)
    app.mount(element)
    return app
  }
  return null
}

if (document.getElementById("vue-app")) {
  mountVueApp("vue-app")
}

window.mountVueQuiz = mountVueApp
