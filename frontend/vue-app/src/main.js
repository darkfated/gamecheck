import { defineCustomElement } from 'vue'
import App from './App.vue'

// Преобразуем Vue компонент в Custom Element и экспортируем его
const VueGameWidget = defineCustomElement(App)

// Делаем компонент глобально доступным
if (typeof window !== 'undefined') {
  window.VueGameWidget = VueGameWidget
}

// Регистрируем Custom Element сразу, если мы в браузере
if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
  if (!customElements.get('vue-game-widget')) {
    try {
      customElements.define('vue-game-widget', VueGameWidget)
      console.log('Vue web component registered successfully')
    } catch (e) {
      console.error('Error registering vue-game-widget:', e)
    }
  }
}

// Экспортируем для возможности использования в других местах
export { VueGameWidget } 