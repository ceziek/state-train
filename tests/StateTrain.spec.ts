import { StateTrain } from '../src/';

describe('calculate', () => {
  let component: StateTrain;
  const state = { prop1: { subProp1: [{ a: '1', b: 2 }] } };

  beforeEach(() => {
    component = new StateTrain(state);
  });

  it('add', () => {
    expect(component).toBeTruthy();
  })
});
