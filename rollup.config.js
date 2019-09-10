import { terser } from "rollup-plugin-terser";
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist/src/StateTrain.js', // our source file
  output: [
    {
      file: 'dist/bundle.js',
      format: 'cjs'
    }
  ],
  plugins: [
    resolve(),
    terser() // minifies generated bundles
  ],
  cache: false,
  treeshake: true
};
