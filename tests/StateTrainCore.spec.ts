import { StateTrainCore } from '../src/StateTrainCore';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('calculate', () => {
  let component: StateTrainCore;

  const expectedState = { prop: 'value' };
  const store = {
    path: ['path', 'another_path', 0],
    state: expectedState
  };

  beforeEach(() => {
    component = new StateTrainCore();
    (<any>component).store$ = of(store)
  });

  it('should init State Train Core', () => {
    expect(component).toBeTruthy();
  });

  it('should return state as Observable', async () => {
    const state = await component.asObservable().pipe(take(1)).toPromise();
    expect(state).toEqual(expectedState)
  });

  it('should return state as Promise', async () => {
    const state = await component.toPromise()
    expect(state).toEqual(expectedState)
  })
});
