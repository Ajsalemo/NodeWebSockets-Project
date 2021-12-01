<template>
  <div class="flex h-screen w-full">
    <LeftSidebar />
    <div class="bg-white w-1/2">
      <Header />
      <div>
        <span v-if="isConnected === true"
          >You are now connected via WebSockets</span
        >
        <span v-if="isConnected === null || ws === null">Loading..</span>
        <span v-if="isConnected === false">Connecting..</span>
        <form @submit.prevent="submit" v-if="isConnected === true">
          <input type="text" v-model="message" name="message" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
    <RightSidebar />
  </div>
</template>

<script>
import LeftSidebar from "./LeftSidebar.vue";
import RightSidebar from "./RightSidebar.vue";
import Header from "./Header.vue";

export default {
  name: "Main",
  components: {
    LeftSidebar,
    RightSidebar,
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
        console.log("Client connection is closed.");
        this.isConnected = false;
        if (this.ws.readyState === 3) {
          this.ws = null;
          setTimeout(this.connect(), 10000);
        }
      });

      this.ws.addEventListener("message", (e) => {
        console.log(e.data);
      });

      this.ws.addEventListener("error", (e) => {
        console.log(e);
      });
    },
    submit() {
      if (this.ws.readyState === 1) {
        return this.ws.send(this.message);
      }
      console.error("An error has occurred. Please try again");
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
      message: "",
      ws: null,
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
