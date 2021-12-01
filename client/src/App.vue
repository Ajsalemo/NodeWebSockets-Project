<template>
  <div class="grid grid-cols-2 h-screen">
    <Sidebar />
    <Main />
  </div>
</template>

<script>
import Main from "./components/Main.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  name: "App",
  components: {
    Main,
    Sidebar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
