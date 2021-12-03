<template>
  <div
    class="
      bg-white
      border-solid border-2 border-blue-100
      h-16
      flex
      justify-start
      items-center
    "
  >
    <p v-if="isConnected === true" class="text-sm font-bold text-left pl-2">
      #You are now connected via WebSockets
    </p>
    <p v-else class="text-sm font-bold text-left pl-2">Connecting..</p>
  </div>
</template>

<script>
export default {
  props: {
    isConnected: Boolean,
  },
};
</script>
    
