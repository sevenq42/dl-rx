<template>
  <div id="app">
    <h2> LOCAL </h2>
    <local-point-annotator :svg-height="400" :svg-width="800"/>
    <local-point-annotator :svg-height="400" :svg-width="800"/>
<hr>

    <h2> SHARED</h2>

    <shared-point-annotator :svg-height="400" :svg-width="800"/>
    <shared-point-annotator :svg-height="400" :svg-width="800"/>
<hr>

    <h2> SOCKET</h2>

    <socket-point-annotator :svg-height="400" :svg-width="800"/>
    <socket-point-annotator :svg-height="400" :svg-width="800"/>

  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import SharedPointAnnotator from './components/SharedPointAnnotator.vue'
    import LocalPointAnnotator from './components/LocalPointAnnotator.vue'
    import SocketPointAnnotator from "@/components/SocketPointAnnotator.vue";

    export default Vue.extend({
        name: 'App',
        components: {
            SharedPointAnnotator,
            LocalPointAnnotator,
            SocketPointAnnotator,
        },
        subscriptions(): any {

            return {
            }
        }
    });
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

  .point-annotator {
    display: inline;
  }
</style>
