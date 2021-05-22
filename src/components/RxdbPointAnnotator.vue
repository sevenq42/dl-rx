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

    <button v-stream:click="load$">Load from RXDB</button>
  </div>

</template>

<script lang="ts">
    import {addRxPlugin, createRxDatabase} from 'rxdb'
    import idb from 'pouchdb-adapter-idb'
    addRxPlugin(idb)
    import {Subject} from 'rxjs'
    import {startWith, switchMap, take, takeWhile, tap, toArray} from 'rxjs/operators'
    import {annotationsFromSocket$} from "@/api/SocketService";
    import {Annotation} from "@/model/Annotation";
    import {Observables} from "vue-rx";

    export default {
        name: "RxdbPointAnnotator",
        subscriptions (): Observables  {
            // @ts-ignore
            this.load$ = new Subject<{event: MouseEvent, data: Record<string, unknown>}>()
                .subscribe((value: {event: MouseEvent, data: Record<string, unknown>}) => {

                        // @ts-ignore
                        const db = this.db
                        annotationsFromSocket$.subscribe(
                            async annos => {
                                console.log('got anno from socket:', annos)
                                await db.annotations.bulkInsert(annos)
                                // @ts-ignore
                                console.log(`inserted ${annos.length} rows: `)
                            },
                            error => { console.warn(error)},
                            () => { console.log('completed inserting')}
                        )
                        // re-load
                        annotationsFromSocket$.next('annotations-get')
                    },
                    error => { console.warn(error)},
                    () => { console.log('completed loading')})

            return {}
        },
        async mounted() {
            // @ts-ignore
            this.db = await createRxDatabase({
                name: 'heroesdb',           // <- name
                adapter: 'idb',          // <- storage-adapter
                password: 'myPassword',     // <- password (optional)
                multiInstance: true,         // <- multiInstance (optional, default: true)
                eventReduce: false // <- eventReduce (optional, default: true)
            });

            // @ts-ignore
            await this.db?.addCollections({
                annotations: {
                    schema: {
                        title: 'annotationsDbSchema',
                        version: 0,
                        properties: {
                            id: { type: 'string'},
                            top: { type: 'number'},
                            left: { type: 'number'},
                            label: { type: 'string'},
                        }
                    }
                }
            })
            // @ts-ignore
            const vm = this
            // @ts-ignore
            this.db?.annotations?.find().$.subscribe(newAnnos => {
                // @ts-ignore
                vm.annotations = newAnnos.map( (rxdbAnno: any) => {
                    return {
                        id: rxdbAnno.id,
                        left: rxdbAnno.left,
                        top: rxdbAnno.top,
                        label: rxdbAnno.label
                    } as Annotation
                })
            })
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
        },
        data() {
            return {
                db: undefined,
                annotations: [],
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
