const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const outdirectory = 'dist';

fs.readdir(outdirectory, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    if (
      file.endsWith('.js') ||
      file.endsWith('.css') ||
      file.endsWith('.js.map')
    ) {
      fs.unlink(path.join(outdirectory, file), (err) => {
        if (err) throw err;
      });
    }
  }
});


let config = '-build';
if (process.argv.length > 2) {
  config = process.argv[2];
}

config == '-watch' &&
esbuild.build({
  entryPoints: ['src/testData/index.js'],
  outfile: 'dist/index.js',
  bundle: true,
  define: {'process.env.NODE_ENV': '"production"'},
  sourcemap: true,
  minify: false,
  watch: true,
  target: [
    'es2017',
  ],
});

config == '-demo' &&
esbuild.build({
  entryPoints: ['demo/registration-form/index.js', 'demo/ajax-form/index.js', 'demo/multistep-form/index.js'],
  outdir: 'demo/out',
  outbase: 'demo',
  sourcemap: false,
  target: [
    'es2017',
  ],
  bundle: true
})

config == '-build' &&
esbuild.build({
  entryPoints: ['src/Formurai.js'],
  outfile: 'dist/index.js',
  sourcemap: true,
  define: {'process.env.NODE_ENV': '"production"'},
  target: [
    'es2017',
  ],
}) &&
console.log('building');


