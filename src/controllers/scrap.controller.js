const axios = require("axios");
const { createHistory } = require("./history.controller");
const logger = require("../utils/logger.utils");
const { createSearch, updateDate } = require("./search.controller");

const requestToken = process.env.REQUEST_TOKEN;
const instagramPort = process.env.INSTAGRAM_PORT;
const twitterPort = process.env.TWITTER_PORT;
const facebookPort = process.env.FACEBOOK_PORT;

const createAxiosInstance = (url, port, token) => {
    let axiosInstance = axios.create({
      baseURL: `${url}:${port}`,
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
    });
    return axiosInstance;
};

const scrap = async ({user_keywords,endpoint,server,keywords,premium,social_port,type, isFavorite, client,user, relaunched = false,id_search = ""}) => {

    const serverUrl = `http://${server}`
    const scrapInstance = createAxiosInstance(serverUrl,social_port,requestToken);

    let scrapBody = {
        "instagramUsers":[],
        "facebookUsers":[],
        "twitterUsers":[],
        "youtubeUsers":[],
        "banned_users":[],
        "banned_words":[],
        "keywords":[],
        "subjects":[],
        "type":type
    };
    let social_network = '';

    if( premium ){
        endpoint = `/${premium}-days-search`
    }

    switch (social_port.toString()) {
        case instagramPort.toString():
            social_network='Instagram'
            scrapBody = {
                ...scrapBody,
                "instagramUsers": user_keywords
            }
            break;

        case twitterPort.toString():
            social_network='Twitter'
            if( !keywords ){
                scrapBody = {
                    ...scrapBody,
                    "twitterUsers": user_keywords
                }
            } else {
                scrapBody = {
                    ...scrapBody,
                    "keywords": user_keywords
                }
            }
            break;
        
        case facebookPort.toString():
            social_network='Facebook'
            scrapBody = {
                ...scrapBody,
                "facebookUsers": user_keywords
            }
            break;

        default:
            throw "The social_port don't match with any port configured in backend."
    }


    if( scrapInstance ) {
        let error = false;

        console.log({scrapBody})

        return new Promise( (resolve, reject) => {

            

            scrapInstance
                .post(endpoint,scrapBody)
                .then( res => {
                    if( !relaunched ) {
                        createSearch({
                            users_keywords: user_keywords, 
                            client, 
                            social_network, 
                            index: type, 
                            isFavorite, 
                            premium: (premium !== ""),
                            keywords,
                            endpoint,
                            social_port
                        }, user)
                        // createHistory({
                        //     type,
                        //     client,
                        //     users_keywords: user_keywords,
                        //     social_network,
                        //     server,
                        //     userName:user
                        // })
                    } else {
                        updateDate(user,id_search)
                    }
                    resolve(`Successfully sended to ${serverUrl}:${social_port}${endpoint}: {${res.config.data}}`)
                })
                .catch( err => {
                    reject( err.message )
                });
        })
    }
}



module.exports = {
    scrap
}