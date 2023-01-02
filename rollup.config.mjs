import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

export default {
   input: 'src/index.jsx',
   output: {
      file: 'dist/index.js',
      format: 'umd',
      exports: 'named',
      extend: true,
   },
   plugins: [
      nodeResolve({
         extensions: ['.ts', '.js', '.tsx', '.jsx'],
      }),
      babel({
         compact: false,
         babelHelpers: 'bundled',
         extensions: ['.ts', '.js', '.tsx', '.jsx'],
         presets: ["@babel/preset-typescript", "@babel/preset-react"],
      }),
      commonjs(),
      replace({
         preventAssignment: false,
         'process.env.NODE_ENV': '"development"',
      }),
      // terser()
   ]
}