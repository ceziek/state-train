import { StateTrain } from '../src/StateTrain';

describe('StateTrain', () => {
  let component: StateTrain;
  const state = { prop1: { subProp1: [{ a: '1', b: 2 }] } };

  beforeEach(() => {
    component = new StateTrain(state);
  });

  it('should init State Train', () => {
    expect(component).toBeTruthy();
  })
});
