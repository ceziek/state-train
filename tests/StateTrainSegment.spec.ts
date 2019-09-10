import { StateTrainSegment } from '../src/StateTrainSegment';
import { of, Subject } from 'rxjs';
import { Store } from '../src/Store';

describe('StateTrainSegment', () => {
  let component: StateTrainSegment;

  beforeEach(() => {
    const store: Store = { path: [], state: {} };
    const store$ = of<Store>(store);
    const set$ = new Subject<Store>();

    component = new StateTrainSegment(store$, set$);
  });

  it('should init State Train Segment', () => {
    expect(component).toBeTruthy();
  });

  it('should get state part by property name', async () => {
    const state = { prop1: 'first', prop2: 'second', prop3: 'third' };
    const store = {
      path: [],
      state: state
    };

    (<any>component).store$ = of(store);
    let value = await component.get('prop1').toPromise();
    expect(value).toEqual('first');

    value = await component.get('prop3').toPromise();
    expect(value).toEqual('third')
  });

  it('should get state part by array index', async () => {
    const state = ['first', 'second', 'third'];
    const store = {
      path: [],
      state: state
    };

    (<any>component).store$ = of(store);
    let value = await component.get(0).toPromise();
    expect(value).toEqual('first');

    value = await component.get(2).toPromise();
    expect(value).toEqual('third')
  });

  it('should find element when state is array', async () => {
    const state = [{ a: 1, b: 1, c: 1 }, { a:2, b: 2, c: 2 }];
    const store = {
      path: [],
      state: state
    };

    (<any>component).store$ = of(store);
    let element = await component.find({ a: 1 }).toPromise();
    expect(element).toEqual(state[0]);

    element = await component.find({ b: 2 }).toPromise();
    expect(element).toEqual(state[1]);

    element = await component.find({ c: 2 }).toPromise();
    expect(element).toEqual(state[1]);
  });

  it('should find element when state is object', async () => {
    const state = { prop1: { a: 1, b: 1, c: 1 }, prop2: { a:2, b: 2, c: 2 } };
    const store = {
      path: [],
      state: state
    };

    (<any>component).store$ = of(store);
    let element = await component.find({ a: 1 }).toPromise();
    expect(element).toEqual(state.prop1);

    element = await component.find({ b: 2 }).toPromise();
    expect(element).toEqual(state.prop2);

    element = await component.find({ c: 2 }).toPromise();
    expect(element).toEqual(state.prop2);
  });

  it('should emit new state on set', async () => {
    const state = [ 'a', 'b', 'c'];
    const store = {
      path: [],
      state: state
    };
    (<any>component).store$ = of(store);

    const set$Spy = spyOn((<any>component).set$, 'next');

    const newState = { a:1, b:2 };
    const newStore = {
      path: store.path,
      state: newState
    };

    await component.set(newStore.state);
    expect(set$Spy).toHaveBeenCalledWith(newStore);
  });

  it('should emit patched state object in store on patch', async () => {
    const state = { a:1, b:2 };
    const store = {
      path: [],
      state: state
    };
    (<any>component).store$ = of(store);

    const set$Spy = spyOn((<any>component).set$, 'next');

    const newState = { a:1, b:8, c: 3};
    const newStore = {
      path: store.path,
      state: newState
    };

    await component.patch({ b:8, c: 3 });
    expect(set$Spy).toHaveBeenCalledWith(newStore);
  });

  it('should emit patched state array in store on patch', async () => {
    const state = [ 'a', 'b', 'c'];
    const store = {
      path: [],
      state: state
    };
    (<any>component).store$ = of(store);

    const set$Spy = spyOn((<any>component).set$, 'next');

    const newState = [ 'a', 'b', 'c', 'd'];
    const newStore = {
      path: store.path,
      state: newState
    };

    await component.patch('d');
    expect(set$Spy).toHaveBeenCalledWith(newStore);
  })
});
