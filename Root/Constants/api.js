const axios = require('axios');
const botConfig = require('../../Config.js')
module.exports = () => {
    const osuinstance = axios.create({
        baseURL: botConfig.apidomain,
        headers: {'X-Custom-Header': 'foobar'}
      });
    
    return osuinstance;
}