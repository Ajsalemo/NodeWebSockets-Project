<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>Chat</h3>
    <button @click="connect">Connect to chat</button>
    <input type="text" v-if="isConnected === true" />
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
      const url = process.env.HOST_URL
        ? `ws://${process.env.HOST_URL}`
        : "ws://localhost:3000";
      const wsClient = new WebSocket(url);

      wsClient.onopen = () => {
        console.log(`Connection to ${url} has been established`);
        this.isConnected = true;
      };

      wsClient.onmessage = (e) => {
        console.log(e.data);
      };

      wsClient.onerror = (err) => {
        console.log(`WebSocket error: ${err}`);
      };
    },
  },
  data() {
    return {
      isConnected: false,
    };
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
