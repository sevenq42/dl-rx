<template>
  <div class="point-annotator">
    <svg class="point-annotator-svg" :width="svgWidth" :height="svgHeight" v-stream:click="click$">
      <g  v-for="annotation in annotations"  :key="annotation.id">
        <circle
                :cx="annotation.left"
                :cy="annotation.top"
                :r="5"
                :style="'stroke: red;'"
        />
        <text
          :dx="annotation.left + 4"
          :dy="annotation.top + 4">
          {{annotation.label}}
        </text>
      </g>
    </svg>

    CLICKS: {{clicksCount}}

    <button v-stream:click="cancel$">STOP</button>
  </div>

</template>

<script lang="ts" >
    import { Subject } from 'rxjs'
    import {map, startWith, scan, takeUntil, shareReplay} from 'rxjs/operators'
    import {Annotation} from "@/model/Annotation";
    import {v4 as uuid} from 'uuid'
    import {annotations$} from "@/api/AnnotationService";

    export default {
        name: "SharedPointAnnotator",

        subscriptions (): unknown {
            this.click$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()
            this.cancel$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()
            this.serviceStream$ = annotations$

                const vm = this.serviceStream$
                this.click$.pipe(
                    takeUntil(this.cancel$)
                ).subscribe((evtData: {event: MouseEvent}) => {
                    const {event} = evtData
                    let newId = uuid();
                    vm.next([
                        {
                            id: newId,
                            left: event.offsetX,
                            top: event.offsetY,
                            label: 'Label_' + newId
                        }])
                })

            return {
                clicksCount: this.click$.pipe(
                    map(() => 1),
                    startWith(0),
                    scan((total:number, change:number) => total + change)
                ),
                annotations: this.serviceStream$.pipe(takeUntil(this.cancel$))
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
  .point-annotator {
    width: 100%;
    height: 100%;

  }

  .point-annotator-svg {
    border: 1px solid black;
  }
</style>
