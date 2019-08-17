import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { flatMap, map, scan, take, takeLast, tap } from 'rxjs/operators';

interface ChildEmitter {
  path: string[],
  value: any
}

class Child {
  constructor(
    private path: any[],
    private state$: Observable<any>,
    private emitter$: Subject<ChildEmitter>
  ) {
  }

  get(path: string | string[]) {
    const path$ = Array.isArray(path) ? from(path) : of(path);
    const getState$ = (state) => path$
      .pipe(
        tap(path => this.path.push(path)),
        scan((acc, curr) => acc[curr], state),
        takeLast(1)
      );

    const state$ = this.state$
      .pipe(
        flatMap((state) => getState$(state))
      );

    return new Child([ ...this.path ], state$, this.emitter$);
  }

  async set(value) {
    const path = [ ...this.path ];
    const emitter: ChildEmitter = { path, value };
    this.emitter$.next(emitter)
  }

  asObservable() {
    return this.state$
  }

  async asPromise() {
    try {
      return await this.state$.pipe(take(1)).toPromise()
    } catch (err) {
      console.log(err);
    }
  }

}

class Parent {
  private path = []
  private state$ = new BehaviorSubject({});
  private emitter$: Subject<ChildEmitter> = new Subject();

  constructor(state) {
    this.state$.next(state)

    this.emitter$
      .subscribe(({ path, value }) => {})

  }

  get(path: string | string[]) {
    const path$ = Array.isArray(path) ? from(path) : of(path);
    const getState$ = (state) => path$
      .pipe(
        tap(path => this.path.push(path)),
        scan((acc, curr) => acc[curr], state),
        takeLast(1)
      );

    const state$ = this.state$
      .pipe(
        flatMap((state) => getState$(state))
      );

    return new Child([ ...this.path ], state$, this.emitter$);
  }

  async set(name, value) {
    const state = await this.state$
      .pipe(take(1))
      .toPromise();

    state[name] = value;
    this.state$.next(state);
    return true
  }
}

const state = {
  prop1: { subProp1: 'SUBPROP1' },
  prop2: 'PROP2'
};

const parent = new Parent(state);

// console.log(parent.get(['prop1']));
// console.log(parent.get(['prop1']).asPromise().then(data => console.log(data)));
parent
  .get('prop1')
  .asObservable()
  .subscribe((data) => console.log(data));
