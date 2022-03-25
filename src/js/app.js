import "regenerator-runtime"
import "../css/styles.scss"
import "../assets/images/favicon-32x32.png"
import { createApp as createVueApp } from "vue"
import App from "@/App.vue"

const createApp = () => {
    const app = createVueApp(App)

    return {
        app,
    }
}

const { app } = createApp()

app.mount("#app")
