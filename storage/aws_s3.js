const AWS = require('aws-sdk');
const env = require("../env");

// Creates a client
const storage = new AWS.S3({
    accessKeyId: env("AWS_ACCESS_KEY_ID"),
    secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
    region: env("AWS_DEFAULT_REGION"),
});

// console.log(env("AWS_ACCESS_KEY_ID"))
// console.log(env("AWS_SECRET_ACCESS_KEY"))
// console.log(env("AWS_DEFAULT_REGION"))

const bucketName = env("AWS_BUCKET_NAME");
const options = {
    Bucket: bucketName,
};
async function create_bucket() {
    try {
        await storage.createBucket(options).promise();
    } catch (e) {
        console.log("BUCKET CREATION FAILED:", e)
    }
}

async function get_bucket() {
    try {
        //check bucket
        await storage.headBucket(options).promise();
    } catch (e) {
        //if bucket not exists
        console.log(e.message)
        await create_bucket();
    } finally {
        return storage;
    }
}

module.exports = get_bucket;