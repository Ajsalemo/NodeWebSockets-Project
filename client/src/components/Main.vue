<template>
  <div class="flex h-screen w-full font-ui">
    <LeftSidebar />
    <div class="bg-white w-full">
      <Header :isConnected="this.isConnected" />
      <div>
        <ul v-if="serverMessages.length > 0" class="flex flex-col">
          <li
            v-for="(message, i) in serverMessages"
            :key="i"
            class="text-left flex flex-col"
          >
            <div class="flex flex-row">
              <p class="text-sm font-bold">{{ message.user }}</p>
              <p class="text-xs self-center pl-2">{{ message.serverTime }}</p>
            </div>
            <p class="text-xs">{{ message.msg }}</p>
          </li>
        </ul>
        <form
          @submit.prevent="submit"
          v-if="isConnected === true"
          class="absolute bottom-0"
        >
          <input type="text" v-model="chat" name="chat" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import LeftSidebar from "./LeftSidebar.vue";
import Header from "./Header.vue";

export default {
  name: "Main",
  components: {
    LeftSidebar,
    Header,
  },
  methods: {
    connect() {
      this.ws = new WebSocket(
        process.env.HOST_URL
          ? `ws://${process.env.HOST_URL}`
          : "ws://localhost:3000"
      );

      this.ws.addEventListener("open", () => {
        console.log(`Connection to ${this.ws.url} has been established`);
        this.isConnected = true;
      });

      this.ws.addEventListener("close", () => {
        console.error("Client connection is closed.");
        this.isConnected = false;
        // This has the client automatically reconnect if the server closes the connection
        if (this.ws.readyState === 3) {
          this.ws = null;
          setTimeout(this.connect(), 10000);
        }
      });

      this.ws.addEventListener("message", (e) => {
        if (e && e.data) {
          console.log(JSON.parse(e.data));
          this.serverMessages.push(JSON.parse(e.data));
        }
      });

      this.ws.addEventListener("error", (e) => {
        console.log(e);
      });
    },
    submit() {
      if (this.ws.readyState === 1) {
        this.clientMessages.push(this.chat);
        console.log(this.clientMessages);
        this.ws.send(this.chat);
      } else {
        console.error("An error has occurred. Please try again");
      }
    },
    check() {
      switch (this.ws.readyState) {
        case 3:
          console.log(
            `Websockets state: ${this.ws.readyState} - Closed. Reconnecting..`
          );
          this.isConnected = false;
          break;
        case 2:
          console.log(`Websockets state: ${this.ws.readyState} - Closing..`);
          this.isConnected = null;
          break;
        case 1:
          console.log(
            `Websockets state: ${this.ws.readyState} - Open. Connected.`
          );
          this.isConnected = true;
          break;
        case 0:
          console.log(
            `Websockets state: ${this.ws.readyState} - Open. Connecting..`
          );
          this.isConnected = null;
          break;
        default:
          break;
      }
    },
  },
  data() {
    return {
      isConnected: false,
      serverMessages: [],
      clientMessages: [],
      ws: null,
      chat: "",
    };
  },
  mounted() {
    this.connect();
  },
  beforeUnmount() {
    console.log(
      `Disconnecting from the current WebSocket session - WebSocket state: ${this.ws.readyState}`
    );
    if (this.ws.readyState === 0 || this.ws.readyState === 1) {
      this.ws.close();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
