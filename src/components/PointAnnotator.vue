<template>
  <div class="point-annotator">
    <svg class="point-annotator-svg" :width="svgWidth" :height="svgHeight" v-stream:click="click$">
      <circle v-for="annotation in annotations"
              :key="annotation.id"
              :cx="annotation.left"
              :cy="annotation.top"
              :r="5"
              :style="'stroke: red;'"
      />
    </svg>

    CLICKS: {{count}}

    <button v-stream:click="cancel$">STOP</button>
  </div>

</template>

<script lang="ts" >
    import { Subject } from 'rxjs'
    import {map, startWith, scan, takeUntil, shareReplay} from 'rxjs/operators'
    import {Annotation} from "@/model/Annotation";
    import {v4 as uuid} from 'uuid'
    import {ANNOTATION_SERVICE_INSTANCE} from "@/api/AnnotationService";

    export default {
        name: "PointAnnotator",

        subscriptions (): unknown {
            // declare the receiving Subjects
            this.click$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()
            this.cancel$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()
            this.serviceStream$ = this.useService ? ANNOTATION_SERVICE_INSTANCE.annotations$ : undefined

            if(this.useService){
                const vm = this.serviceStream$
                // const existingAnno = this.$subscriptions.annotations
                this.click$.subscribe((evtData: {event: MouseEvent}) => {
                    const {event} = evtData
                    vm.next([
                        // ...(vm ?? []),
                        {
                        id: uuid(),
                        left: event.offsetX,
                        top: event.offsetY,
                        label: 'MyLabel'
                    }])
                })
            }
            // ...then create subscriptions using the Subjects as source stream.
            // the source stream emits in the format of `{ event: HTMLEvent, data?: any }`

            return {
                count: this.click$.pipe(
                    map(() => 1),
                    startWith(0),
                    scan((total:number, change:number) => total + change)
                ),
                annotations: this.useService ? this.serviceStream$.pipe(takeUntil(this.cancel$)) :  this.click$.pipe(
                    map((evtData: {event: MouseEvent}) => {
                        const {event} = evtData
                        return {
                            id: uuid(),
                            left: event.offsetX,
                            top: event.offsetY,
                            label: 'MyLabel'
                        }
                    }),
                    startWith([
                        {
                            id: uuid(),
                            left: 100,
                            top: 100,
                            label: 'MyLabel123'
                        }
                    ]),
                    takeUntil(this.cancel$),
                    scan((total:Array<Annotation>, change:Annotation) => {
                        return [...(total ?? []), change]
                    })
                ),
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
