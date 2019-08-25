import { Observable, pipe, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as _ from 'lodash';

import { StateTrainCore, Store } from './StateTrainCore';

export class StateTrainSegment extends StateTrainCore {
  constructor(
    protected store$: Observable<Store>,
    protected set$: Subject<Store>
  ) {
    super();
  }

  get(nextPath: string | number): StateTrainSegment {
    const store$: Observable<Store> = this.store$
      .pipe(
        map(({ path, state }): Store => ({
          path: [...path, nextPath],
          state: state[nextPath]
        }))
      );

    return new StateTrainSegment(store$, this.set$);
  }

  find(params: {[key: string]: any}): StateTrainSegment {
    const store$: Observable<Store> = this.store$
      .pipe(
        map(({ path, state }): Store => {
          const nextPath = _.isArray(state) ? _.findIndex(state, params) : _.findKey(state, params);
          return { path: [...path, nextPath], state: state[nextPath] }
        })
      );

    return new StateTrainSegment(store$, this.set$);
  }

  async set(state): Promise<void> {
    try {
      const newStore = await this.store$
        .pipe(
          take(1),
          map(({ path }) => ({ path, state }))
        )
        .toPromise();

      this.set$.next(newStore);
    } catch (err) {
      console.log(err);
    }
  }

  async patch(newValue): Promise<void> {
    try {
      const patchStorePipe = pipe(
        take(1),
        map(({ path, state }) => {
          const array = _.isArray(state) && [...state, newValue];
          const object = _.isObject(state) && { ...state, ...newValue };
          state = array || object || newValue;
          return { path, state }
        })
      );

      const newStore = await this.store$.pipe(patchStorePipe).toPromise();
      this.set$.next(newStore);
    } catch (err) {
      console.log(err);
    }
  }
}
