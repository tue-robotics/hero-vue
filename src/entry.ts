// Import Bootstrap CSS for component styling
import 'bootstrap/dist/css/bootstrap.css'

// Import vue components
import type { App, Plugin } from 'vue'
import * as components from './components/index'

// install function executed by app.use()
const install = function installHeroVue(app: App) {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component)
  })
}

// Create module definition for app.use()
const plugin: Plugin = {
  install
}

// Default export is library as a whole, registered via app.use()
export default plugin

// To allow individual component use, export components
// each can be registered via app.component()
export * from './components/index'
