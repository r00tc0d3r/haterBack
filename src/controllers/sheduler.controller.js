require('dotenv').config();
const userModel = require('../../model/user.model');
const httpStatus = require('http-status-codes');
var rp = require('request-promise');
const  uuid = require('uuid');

exports.addJob = async (req,res,next) => {
    const timer = req.body.timer;
    const userId = req.body.userId;
    const name = req.body.name;
    const postType = req.body.postType;
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    const post = req.body.post ? req.body.post : null ;    
    const user = await userModel.findOne({ _id: userId });
    const username = user.username;
    const type = req.body.type ? req.body.type : null;
    const subject = req.body.subject ? req.body.subject : null;
    const postNumber = req.body.postNumber ? req.body.postNumber : null;

    const dkronBody = { 
            name: `${uuid.v4()}`,
            displayname: name,
            schedule: `@every ${timer}`,
            retries: parseInt(process.env.DKRON_RETRIES, 10),
            concurrency: 'allow',
            executor: 'http',
            executor_config: {
                debug: 'true',
                expectCode: '200',
                method: 'POST',
                headers: `[\"Authorization: ${token}\",\"Content-Type: application/json\"]`,
                body: JSON.stringify({
                    post,
                    username,
                    timer,
                    subject,
                    postNumber,
                    type
                }),
                timeout: '30',
                url: `${process.env.LOCALURL}api/${postType}`
            }
    };

    rp({
        method: 'POST',
        uri:`${process.env.DKRON_URL}/v1/jobs`,
        body: dkronBody,
        json:true
    }).then(function(response){
        if(response){
            res.status(httpStatus.OK);
            res.json('ok');
        }
    }).catch(function(e){
        console.log("Error to send job",e);
        res.status(httpStatus.BAD_REQUEST);
        res.json({error: httpStatus.getStatusText(httpStatus.BAD_REQUEST)});
    })
};

exports.getJob = async (req,res,next) =>{
    const jobId = req.params.id;
    rp(`${process.env.DKRON_URL}/v1/jobs/${jobId}`)
    .then(function(response){
        if(response){
            res.status(httpStatus.OK);
            res.json(JSON.parse(response));
        }
    }).catch(function(e){
        console.log("Error to get job",e);
        res.status(httpStatus.BAD_REQUEST);
        res.json({error: httpStatus.getStatusText(httpStatus.BAD_REQUEST)});
    })
}

exports.getAllJobs = async (req,res,next) => {
    rp(`${process.env.DKRON_URL}/v1/jobs`)
    .then(function(response){
        if(response){
            res.status(httpStatus.OK);
            res.json(JSON.parse(response));
        }
    }).catch(function(e){
        console.log("Error to get all jobs",e);
        res.status(httpStatus.BAD_REQUEST);
        res.json({error: httpStatus.getStatusText(httpStatus.BAD_REQUEST)});
    })
}

exports.deleteJob = async (req,res,next) =>{
    const jobId = req.params.id;
    rp({
        method: 'DELETE',
        uri:`${process.env.DKRON_URL}/v1/jobs/${jobId}`,
    }).then(function(response){
        if(response){
            res.status(httpStatus.OK);
            res.json('ok');
        }
    }).catch(function(e){
        console.log("Error to delete job",e);
        res.status(httpStatus.BAD_REQUEST);
        res.json({error: httpStatus.getStatusText(httpStatus.BAD_REQUEST)});
    })

}

exports.runJob = async (req,res,next) =>{
    const jobId = req.body.jobId;
    console.log(jobId);
    rp({
        method: 'POST',
        uri:`${process.env.DKRON_URL}/v1/jobs/${jobId}`
    }).then(function(response){
        if(response){
            res.status(httpStatus.OK);
            res.json('ok');
        }
    }).catch(function(e){
        console.log("Error to run job",e);
        res.status(httpStatus.BAD_REQUEST);
        res.json({error: httpStatus.getStatusText(httpStatus.BAD_REQUEST)});
    })
}

exports.toogleJob = async (req,res,next) =>{
    const jobId = req.body.jobId;
    rp({
        method: 'POST',
        uri:`${process.env.DKRON_URL}/v1/jobs/${jobId}/toggle`,
    }).then(function(response){
        if(response){
            res.status(httpStatus.OK);
            res.json('ok');
        }
    }).catch(function(e){
        console.log("Error to stop job",e);
        res.status(httpStatus.BAD_REQUEST);
        res.json({error: httpStatus.getStatusText(httpStatus.BAD_REQUEST)});
    })
}