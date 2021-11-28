<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>Chat</h3>
    <span v-if="isConnected === true"
      >You are now connected via WebSockets</span
    >
    <span v-else>Connecting..</span>
    <form @submit.prevent="submit" v-if="isConnected === true">
      <input type="text" v-model="message" name="message" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    connect() {
      if (this.ws.readyState === 3) {
        console.log("WebSocket connection is currently closed.");
      }
      this.ws.onopen = () => {
        console.log(`Connection to ${this.ws.url} has been established`);
        this.isConnected = true;
      };

      this.ws.onmessage = (e) => {
        console.log(e.data);
      };

      this.ws.onerror = (err) => {
        console.log("WebSocket error: ", err);
      };
    },
    submit() {
      console.log(this.ws.readyState);
      if (this.ws.readyState === 1) {
        this.ws.send(this.message);
      } else if (this.ws.readyState === 3) {
        console.log(`Connection is closed`);
      }
    },
  },
  data() {
    return {
      isConnected: false,
      message: "",
      ws: new WebSocket(
        process.env.HOST_URL
          ? `ws://${process.env.HOST_URL}`
          : "ws://localhost:3000"
      ),
    };
  },
  mounted() {
    console.log(
      `Attempting to connect - WebSocket state: ${this.ws.readyState}`
    );
    this.connect();
  },
  beforeUnmount() {
    console.log(
      `Disconnecting from the current WebSocket session - WebSocket state: ${this.ws.readyState}`
    );
    this.ws.close();
  },
  unmounted() {
    console.log(`WebSocket state: ${this.ws.readyState}`);
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
