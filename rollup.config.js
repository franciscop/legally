import banner from "rollup-plugin-banner";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import json from "rollup-plugin-json";

export default {
  input: `src/index.js`,
  output: {
    file: `index.min.js`,
    format: "cjs",
    name: "legally"
  },
  plugins: [
    json(),
    resolve({ preferBuiltins: true }),
    commonjs(),
    terser(),
    banner("<%= pkg.name %> by <%= pkg.author %>")
  ]
};
