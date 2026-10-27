// Started from inside the build, so __dirname is the live build folder
module.exports = {
  apps: [
    {
      name: 'dialog',
      script: 'server.js',
      cwd: __dirname,
      // Outside the build folder, so deploys keep it
      node_args: '--env-file-if-exists=../.env',
      instances: 1,
      exec_mode: 'fork',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 2000,
      max_memory_restart: '512M',
      // Time to finish requests in flight on restart
      kill_timeout: 15000,
      time: true,
      env: {
        NODE_ENV: 'production',
        // viceseason uses 3000 and 3002
        PORT: '3010',
        // Only reachable through nginx (HTTPS)
        HOSTNAME: '127.0.0.1'
      }
    }
  ]
}
