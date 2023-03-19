import { spawn } from 'child_process'
import replace from '@rollup/plugin-replace'
import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import css from 'rollup-plugin-css-only'
import sveltePreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'
import { generateSW } from 'rollup-plugin-workbox'

const production = !process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    if (server) server.kill(0)
  }

  return {
    writeBundle() {
      if (server) return
      server = spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    },
  }
}

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.SERVER_URL': process.env.SERVER_URL,
      'process.env.SCHEMA_VERSION': process.env.SCHEMA_VERSION,
      'process.env.SCHEMA_VERSION_KEY': process.env.SCHEMA_VERSION_KEY,
    }),
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
      exportConditions: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload({
      watch: 'public',
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    generateSW({
      swDest: './public/sw.js',
      globDirectory: './public/build/',
    },
    function render({ swDest, count, size }) {
      console.log(
        '📦', swDest,
        '#️⃣', count,
        '🐘', size,
      )
    }),
  ],
  watch: {
    clearScreen: false,
  },
}
