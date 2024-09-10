<template>
  <h1>About Page</h1>
</template>
  
<script>
  
  export default {
    name: 'App',
    components: {

    },
    data() {
      return {
        refreshComp: 0
      }
    },
    methods: {
      change() {
        this.refreshComp += 1
      }
    }
  }
</script>