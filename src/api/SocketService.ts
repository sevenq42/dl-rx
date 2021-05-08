import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {Subject} from "rxjs";
import {Annotation} from "@/model/Annotation";
import {shareReplay} from "rxjs/operators";

const closeSubject = new Subject<CloseEvent>();
closeSubject.subscribe(_ => console.log('Underlying WebSocket connection closed'));

const webSocketSubject = webSocket({
  url: 'ws://localhost:3000/',
  closeObserver: closeSubject,
  openObserver: {
    next: (val) => {
      console.log('Underlying WebSocket connection open', val)
    },
  },
});

// initial load
webSocketSubject.next('annotations-get')
export {
  webSocketSubject as annotationsFromSocket$,
}
