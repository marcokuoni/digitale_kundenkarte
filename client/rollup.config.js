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
import serve from 'rollup-plugin-serve';

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js',
    inlineDynamicImports: true,
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.SERVER_URL': process.env.SERVER_URL,
      'process.env.SCHEMA_VERSION': process.env.SCHEMA_VERSION,
      'process.env.SCHEMA_VERSION_KEY': process.env.SCHEMA_VERSION_KEY,
      'process.env.JWT_COOKIE_NAME': process.env.JWT_COOKIE_NAME,
      'process.env.DEFAULT_URL_TOKEN_BLOCK_FOR_MINUTES': process.env.DEFAULT_URL_TOKEN_BLOCK_FOR_MINUTES,
      'process.env.DEFAULT_URL_TOKEN_VALID_FOR_MINUTES': process.env.DEFAULT_URL_TOKEN_VALID_FOR_MINUTES,
      'process.env.STAMPS_LENGTH': process.env.STAMPS_LENGTH,      
      'process.env.CLIENT_PING_INTERVAL': process.env.CLIENT_PING_INTERVAL,      
      'process.env.SERVER_REQUEST_COUNT_CHECK_INTERVAL': process.env.SERVER_REQUEST_COUNT_CHECK_INTERVAL,      
      'process.env.CHECK_FOR_HOW_MANY_CYCLES': process.env.CHECK_FOR_HOW_MANY_CYCLES,   
      'process.env.BLOCKING_DURATION_MS': process.env.BLOCKING_DURATION_MS,   
      'process.env.CROWN_BAR_URL': process.env.CROWN_BAR_URL,   
      'process.env.CROWN_BAR_INSTA': process.env.CROWN_BAR_INSTA,   
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
    // !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    generateSW({
      swDest: './public/sw.js',
      globDirectory: 'public',
      navigateFallback: '/index.html',
      runtimeCaching: [{
        urlPattern: () => true,
        handler: 'NetworkOnly',
        method: 'POST',
        options: {
          backgroundSync: {
            name: 'graphql_posts',
            options: {
              maxRetentionTime: 60 * 60,
            },
          },
        },
      }]
    },
    function render({ swDest, count, size }) {
      console.log(
        '📦', swDest,
        '#️⃣', count,
        '🐘', size,
      )
    }),
    serve({
      contentBase: 'public',
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': 'null',  //Muss sein wegen server redirects    
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
      host: '0.0.0.0',
      port: 3001,
      onListening: function (server) {
        const address = server.address()
        const host = address.address === '::' ? 'localhost' : address.address
        const protocol = this.https ? 'https' : 'http'
        console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
      }
    })
  ],
  watch: {
    clearScreen: false,
  },
}
