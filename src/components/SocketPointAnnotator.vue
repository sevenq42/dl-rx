<template>
  <div class="point-annotator">
    <svg class="socket-annotator-svg" :width="svgWidth" :height="svgHeight" >
      <g  v-for="annotation in annotations"  :key="annotation.id">
        <circle
                :cx="annotation.left"
                :cy="annotation.top"
                :r="5"
                :style="'stroke: red;'"
        />
        <text
          :dx="(annotation.left || 0) + 4"
          :dy="(annotation.top || 0) + 4">
          {{annotation.label}}
        </text>
      </g>
    </svg>

<!--    annotations: {{annotations}}-->

    <button v-stream:click="load$">Load from Socket</button>
  </div>

</template>

<script lang="ts">
    import {Subject} from 'rxjs'
    import {startWith, switchMap, takeWhile, tap, toArray} from 'rxjs/operators'
    import {annotationsFromSocket$} from "@/api/SocketService";
    import {Observables} from "vue-rx";

    export default {
        name: "SocketPointAnnotator",

        subscriptions (): Observables {
            // @ts-ignore
            this.load$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()
            // @ts-ignore
            this.load$.subscribe(value => {
                // re-load
                annotationsFromSocket$.next('annotations-get')
            })

            // const vm = annotationsFromSocket$
            return {
                annotations: annotationsFromSocket$,
                // annotations: this.load$.pipe(
                //     switchMap(val => annotationsFromSocket$)
                // )
                // annotations: this.load$.pipe(
                //     switchMap(value => {
                //         return vm.pipe(toArray())
                //     }),
                //     // startWith(vm.pipe(toArray()))
                // )
            }
        },
        props: {
            svgWidth: {
                type: Number,
                default: 1200
            },
            svgHeight: {
                type: Number,
                default: 600
            },
            useService: {
                type: Boolean,
                default: false
            }
        }
    }

</script>

<style scoped>
  .socket-annotator {
    width: 100%;
    height: 100%;

  }

  .socket-annotator-svg {
    border: 1px solid black;
  }
</style>
