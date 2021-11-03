const axios = require('axios');
const logger = require('./logger.utils');

const getTweepyInstance = () => {
    //ACA DEBERÏA CONSUMIR CONSUL
    //POR AHORA LO SACMOS DE .ENV
    const tweepyUrl = process.env.TWEEPY_URL
    const tweepyPort = process.env.TWEEPY_PORT;
    const tweepyToken = process.env.TWEEPY_TOKEN;

    let tweepyInstance = createAxiosInstance(tweepyUrl, tweepyPort, tweepyToken);

    return tweepyInstance;
}

const createAxiosInstance = (url, port, token) => {
    let axiosInstance = axios.create({
        baseURL: `${url}:${port}`,
        headers: { 
            'Authorization': `Basic ${token}`,
            'Content-Type' :  'application/json'
            }
    });

    return axiosInstance;
}

const sendToTweepy = (searchInfo) => {
    const { from_date, to_date, type, geo, keywords, consumer_token, consumer_secret, access_token, access_secret_token, environment_name } = searchInfo;

    if (from_date && to_date && type && geo != undefined && keywords && consumer_token && consumer_secret && access_token && access_secret_token) {
        let tweepyInstance = getTweepyInstance();

        if (tweepyInstance) {
            console.log(tweepyInstance);
            try{
                tweepyInstance.post('/first-search', {
                    keywords,
                    from_date,
                    to_date,
                    type,
                    geo,
                    consumer_token,
                    consumer_secret,
                    access_token,
                    access_secret_token,
                    environment_name,
                    twitterUsers: [],
                    banned_users: [],
                    banned_words: []
                })
                .then(function (response) {
                  logger('Successfully sended to Tweepy!');
                })
                .catch(function (error) {
                    logger('Error while sending to Tweepy!');
                });
            }catch(err){
                logger(`An error has ocurred while sending request to Tweepy: ${err}`);
            }
        }
    } else {
        logger('Missing data to send request to Tweepy')
    }
}

module.exports = {
    sendToTweepy
}