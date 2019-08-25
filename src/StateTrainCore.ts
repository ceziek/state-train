import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from './Store';

export class StateTrainCore {
  protected store$: Observable<Store>;
  protected set$ = new Subject<Store>();

  asObservable() {
    return this.store$.pipe(map(store => store.state));
  }

  async toPromise() {
    try {
      return await this.asObservable()
        .pipe(take(1))
        .toPromise()
    } catch (err) {
      console.log(err);
    }
  }
}
