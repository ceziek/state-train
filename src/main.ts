import { StateTrain } from './StateTrain';

const state = {
  prop1: { subProp1: [{ a: { b: 4, c: 8 }, b: 18 }, 'b', 'c'] }
};

const parent = new StateTrain(state);


const subProp1 = parent
  .get('prop1')
  .get('subProp1')
  .get(0)
  .find({ b: 4 });

subProp1
  .asObservable()
  .subscribe(console.log);

// subProp1.patch('gggg');
// subProp1.patch({c: 'vvvv', k: 'bbbb'});


