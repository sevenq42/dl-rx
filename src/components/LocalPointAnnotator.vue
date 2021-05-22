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
          :dx="(annotation.left || 0) + 4"
          :dy="(annotation.top || 0) + 4">
          {{annotation.label}}
        </text>
      </g>
    </svg>

    CLICKS: {{clicksCount}}

    <button v-stream:click="cancel$">STOP</button>
  </div>

</template>

<script lang="ts">
    import {Subject} from 'rxjs'
    import {map, scan, startWith, takeUntil} from 'rxjs/operators'
    import {Annotation} from "@/model/Annotation";
    import {v4 as uuid} from 'uuid'
    import {Observables} from "vue-rx";

    export default {
        name: "LocalPointAnnotator",

        subscriptions (): Observables {
            // declare the receiving Subjects
            // @ts-ignore
            this.click$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()
            // @ts-ignore
            this.cancel$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()

            // annotationsWithInitData.subscribe(annotations$)

            return {
                // @ts-ignore
                clicksCount: this.click$.pipe(
                    map(() => 1),
                    startWith(0),
                    scan((total:number, change:number) => total + change)
                ),
                // @ts-ignore
                annotations: this.click$.pipe(
                    map((evtData: { event: MouseEvent }) => {
                        const {event} = evtData
                        return {
                            id: uuid(),
                            left: event.offsetX,
                            top: event.offsetY,
                            label: 'Label from Click'
                        } as Annotation
                    }),
                    // @ts-ignore
                    takeUntil(this.cancel$),
                    startWith([]),
                    scan((total: Array<Annotation>, change: Annotation) => {
                        const prevAnnotationsArray = Array.isArray(total) ? total : [total]
                        return [...prevAnnotationsArray, change]
                    })
                )
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
