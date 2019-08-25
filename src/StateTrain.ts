import { BehaviorSubject, Observable, OperatorFunction, pipe, Subject } from 'rxjs';
import { flatMap, map, take } from 'rxjs/operators';
import * as _ from 'lodash';

import { StateTrainSegment } from './StateTrainSegment';
import { Store } from './StateTrainCore';

export class StateTrain extends StateTrainSegment {
  protected store$: BehaviorSubject<Store>;

  constructor(state) {
    const path = [];
    const store: Store = { path, state };
    const store$: BehaviorSubject<Store> = new BehaviorSubject<Store>(store);
    const set$ = new Subject<Store>();

    super(store$, set$);

    set$
      .pipe(this.newStorePipe())
      .subscribe((newStore: Store) => this.store$.next(newStore))
  }

  private newStorePipe(): OperatorFunction<Store, Store> {
    const setNewStore = (newStore: Store): Observable<Store> => this.store$
      .pipe(
        take(1),
        map(store => {
          const path = store.path;
          const state = _.set(store.state, newStore.path, newStore.state);
          return { path, state }
        })
      );

    return pipe(flatMap<Store, Observable<Store>>(setNewStore))
  }
}
