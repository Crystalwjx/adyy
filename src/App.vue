<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "./style/common";
#app {
  background: #7f48b4;
  min-height: 100%;
}
</style>
