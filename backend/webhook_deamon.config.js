module.exports = {
  apps: [{
    name: 'webhook',
    script: './webhook_deamon.js',
    instances: 0,
    exec_mode: "cluster"
  }]
}
