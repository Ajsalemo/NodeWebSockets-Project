<template>
  <div class="flex min-h-screen w-full font-ui">
    <LeftSidebar :uniqueServerUsers="uniqueServerUsers" />
    <div class="bg-white w-full">
      <Header :isConnected="this.isConnected" />
      <div class="pt-8">
        <ul v-if="messages.length > 0" class="flex flex-col">
          <li
            v-for="(message, i) in messages"
            :key="i"
            class="text-left flex flex-col"
          >
            <div>
              <div class="flex flex-row">
                <p class="text-sm font-bold">{{ message.clientUser }}</p>
                <p class="text-xs self-center pl-2">{{ message.clientTime }}</p>
              </div>
              <p class="text-xs">{{ message.clientMsg }}</p>
            </div>
            <div>
              <div class="flex flex-row">
                <p class="text-sm font-bold">{{ message.serverUser }}</p>
                <p class="text-xs self-center pl-2">{{ message.serverTime }}</p>
              </div>
              <p class="text-xs">{{ message.serverMsg }}</p>
            </div>
          </li>
        </ul>
        <form
          @submit.prevent="submit"
          v-if="isConnected === true"
          class="absolute bottom-0 ml-12 mb-8"
        >
          <div class="flex flex-col">
            <textarea
              rows="4"
              cols="50"
              v-model="chat"
              name="chat"
              placeholder="Message"
              class="rounded border-2 border-gray-600 border-opacity-25"
            />
            <button type="submit" class="w-8 self-end">
              <i class="far fa-share-square"></i>
            </button>
          </div>
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
          this.messages.push(JSON.parse(e.data));
          /* 
            Loop over the objects coming from the Websocket server to parse the username within
            NOTE: There definitely is a better way to do this, but leaving this as is, for now, since it 'works'
          */
          for (let i = 0; i < this.messages.length; i++) {
            if (
              this.messages[i] &&
              this.messages[i].serverUser !== undefined
            ) {
              const serverSideUser = this.messages[i].serverUser;
              this.serverUsers.push(serverSideUser);
            }
          }
          this.uniqueServerUsers = [...new Set(this.serverUsers)];
        }
      });

      this.ws.addEventListener("error", (e) => {
        console.error(e);
      });
    },
    submit() {
      const clientCurrentTime = new Date();
      const clientCurrentTimeFormatted = clientCurrentTime.toLocaleTimeString();
      const clientMetaData = {
        clientMsg: this.chat,
        clientUser: "TestUser",
        clientTime: clientCurrentTimeFormatted,
      };
      if (this.ws.readyState === 1) {
        this.messages.push(clientMetaData);
        this.ws.send(this.chat);
        this.chat = "";
      } else {
        console.error("An error has occurred. Please try again");
        this.ws.close()
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
      messages: [],
      ws: null,
      chat: "",
      serverUsers: [],
      uniqueServerUsers: null,
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
