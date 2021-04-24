<template>
  <div id="app">
    <point-annotator :svg-height="400" :svg-width="800" :use-service="false"/>
    <point-annotator :svg-height="400" :svg-width="800" :use-service="false"/>

    <point-annotator :svg-height="400" :svg-width="800" :use-service="true"/>
    <point-annotator :svg-height="400" :svg-width="800" :use-service="true"/>

<!--    <button v-stream:click="share$">SHARE STREAM</button>-->

<!--    in parent App: {{useServiceStream}}-->
  </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import PointAnnotator from './components/PointAnnotator.vue'
    import {Subject} from "rxjs";
    import {map, take} from "rxjs/operators";

    export default Vue.extend({
        name: 'App',
        components: {
            PointAnnotator
        },
        subscriptions(): any {
            // this.share$ = new Subject()

            return {
                // useServiceStream: this.share$.pipe(
                //     map(() => true),
                //     take(1)
                // )
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
