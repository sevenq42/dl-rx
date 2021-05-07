import {Subject} from "rxjs";
import {Annotation} from "@/model/Annotation";
import {startWith} from "rxjs/operators";
import {v4 as uuid} from 'uuid'


const initialData$ = new Subject()
  .pipe(
  startWith([
    {
      id: uuid(),
      left: 100,
      top: 100,
      label: 'MyLabel from service'
    },
    {
      id: uuid(),
      left: 200,
      top: 200,
      label: 'MyLabel from service'
    },
    {
      id: uuid(),
      left: 300,
      top: 300,
      label: 'MyLabel from service'
    },
  ])
) as Subject<Annotation[]>

const annotations$: Subject<Annotation[]> = new Subject<Annotation[]>()

annotations$.subscribe(initialData$)

export {
  annotations$
}
