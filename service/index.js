const NacosNamingClient = require('nacos').NacosNamingClient;
const {config}=require('../config')
const logger = console;

const serviceName = config.service.name;

function nacos() {
    const client = new NacosNamingClient({
        logger,
        serverList: config.server.list, // replace to real nacos serverList
        namespace: config.server.namespace,
    });
    return client

}

async function register() {
    const client = nacos()
    await client.ready()
    client.registerInstance(serviceName, {
        ip: config.service.ip,
        port: config.service.port,
    }, config.server.group);
}


async function discovery(){
    const client=nacos()
    await client.ready()
    const instances=await client.getAllInstances(serviceName,config.server.group)


    const [instance]=instances.filter(item=>{
        return item.healthy
    })
    const {ip,port}=instance
    console.log(ip,port)
}

module.exports = { register,discovery}
