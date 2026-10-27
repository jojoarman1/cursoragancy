// pm2 config, shipped inside the standalone build: started from there, so __dirname is the live
// build folder
module.exports = {
  apps: [
    {
      name: 'dialog',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 2000,
      max_memory_restart: '512M',
      // Next asks self-hosted servers for 10–30 s to finish requests in flight on a restart
      kill_timeout: 15000,
      time: true,
      env: {
        NODE_ENV: 'production',
        // viceseason runs on the same server on 3000 (its API on 3002)
        PORT: '3010',
        // Only nginx may reach it: on 0.0.0.0 the site would also open by IP, past HTTPS
        HOSTNAME: '127.0.0.1'
      }
    }
  ]
}
