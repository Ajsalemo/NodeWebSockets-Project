import { createApp } from "vue";
import App from "./App.vue";

const url = process.env.HOST_URL
  ? `ws://${process.env.HOST_URL}`
  : "ws://localhost:3000";

const ws = new WebSocket(url)

const app = createApp(App)
// Provide the Websocket client variable to all components
app.provide("webSocketClient", ws)
app.mount("#app");
