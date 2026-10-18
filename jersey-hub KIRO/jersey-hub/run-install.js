var cp = require('child_process')
var fs = require('fs')
var path = require('path')

var cwd = path.resolve(__dirname)
var logFile = path.join(cwd, 'install-out.log')

fs.writeFileSync(logFile, 'Clean reinstall (memorystore) starting...\n')

var steps = [
  { label: 'remove node_modules', cmd: 'rmdir /s /q node_modules' },
  { label: 'remove package-lock',  cmd: 'del /f package-lock.json' },
  { label: 'npm install',          cmd: 'npm install --no-fund --no-audit' }
]

function runNext(i) {
  if (i >= steps.length) {
    fs.appendFileSync(logFile, '\nALL DONE\n')
    process.exit(0)
    return
  }
  var step = steps[i]
  fs.appendFileSync(logFile, '\n--- ' + step.label + ' ---\n')
  var proc = cp.spawn('cmd.exe', ['/c', step.cmd], {
    cwd: cwd,
    env: Object.assign({}, process.env),
    stdio: ['ignore', 'pipe', 'pipe']
  })
  proc.stdout.on('data', function(d) { fs.appendFileSync(logFile, d.toString()) })
  proc.stderr.on('data', function(d) { fs.appendFileSync(logFile, d.toString()) })
  proc.on('close', function(code) {
    fs.appendFileSync(logFile, 'EXIT:' + code + '\n')
    runNext(i + 1)
  })
  proc.on('error', function(err) {
    fs.appendFileSync(logFile, 'SPAWN ERROR: ' + err.message + '\n')
    process.exit(1)
  })
}

runNext(0)
