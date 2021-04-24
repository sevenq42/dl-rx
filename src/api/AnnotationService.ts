import {Subject} from "rxjs";
import {Annotation} from "@/model/Annotation";
import {startWith} from "rxjs/operators";
import {v4 as uuid} from 'uuid'

export interface AnnotationService {
  annotations$: Subject<Annotation[]>
}
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
class AnnotationServiceImpl implements AnnotationService {
  annotations$: Subject<Annotation[]>;
  constructor() {
    this.annotations$ = new Subject()
    initialData$.subscribe(this.annotations$)
  }
}

export const ANNOTATION_SERVICE_INSTANCE = new AnnotationServiceImpl()
