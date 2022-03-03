const axios = require('axios');
module.exports = () => {
    const ppyinstance = axios.create({
        baseURL: 'https://osu.ppy.sh/api/',
        headers: {'X-Custom-Header': 'foobar'}
      });
    
    return ppyinstance;
}