import { StateTrain } from '../src/StateTrain';
import { of } from 'rxjs';
import { Store } from '../src/Store';

describe('StateTrain', () => {
  let component: StateTrain;
  const state = { prop1: { subProp1: [{ a: '1', b: 2 }] } };

  beforeEach(() => {
    component = new StateTrain(state);
  });

  it('should init State Train', () => {
    expect(component).toBeTruthy();
  });

  it('should generate new updated state', async () => {
    const storeUpdate: Store = {
      path: ['prop1', 'subProp1'],
      state: 'new state'
    };

    const expected: Store = {
      path: [],
      state: { prop1: { subProp1: storeUpdate.state } }
    };

    const result = await of(storeUpdate)
      .pipe((<any>component).newStorePipe())
      .toPromise();

    expect(result).toEqual(expected);
  })
});
