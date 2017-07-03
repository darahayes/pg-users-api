const outputs = [
  {reporter: 'html', output: './coverage/index.html'},
  {reporter: 'console', output: 'stdout'}
]

module.exports = {
  coverage: true,
  leaks: true,
  globals: '__core-js_shared__',
  lint: true,
  timeout: 2e3,
  threshold: 0,
  verbose: true,
  reporter: outputs.map(o => o.reporter),
  output: outputs.map(o => o.output)
}
