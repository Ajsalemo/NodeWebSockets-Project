<template>
  <div class="bg-slackMain w-1/4 flex min-h-screen">
    <div class="w-1/4 border-solid border-2 border-gray-600"></div>
    <div class="flex w-full flex-col">
      <div class="border-solid border-2 border-gray-600 h-16"></div>
      <div class="border-solid border-2 border-gray-600 h-full">
        <ul v-if="uniqueServerUsers" class="text-white text-left pl-2 pt-2">
          <li v-for="(user, j) in uniqueServerUsers" :key="j"># {{ user }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  props: {
    uniqueServerUsers: Array,
  },
};
</script>
