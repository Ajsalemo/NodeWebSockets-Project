<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>Chat</h3>
    <span v-if="isConnected === true">You are now connected via WebSockets</span>
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
  inject: {
    ws: {
      from: "webSocketClient"
    }
  },
  methods: {
    connect() {
      this.ws.onopen = () => {
        console.log(`Connection to ${this.url} has been established`);
        this.isConnected = true;
      };

      this.ws.onmessage = (e) => {
        console.log(e.data);
      };

      this.ws.onerror = (err) => {
        console.log(`WebSocket error: ${err}`);
      };
    },
    submit() {
      this.ws.send(this.message);
    },
  },
  data() {
    return {
      isConnected: false,
      message: "",
    };
  },
  created() {
    this.connect()
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
