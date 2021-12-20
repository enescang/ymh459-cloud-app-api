const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const get_bucked = require("./aws_s3");
const env = require("../env");
const {ERRORS:{FileApiErrors}} = require("../utils/constants");
const mimes = require("mime-types");

const Uploader = async({folder_path, file_name, mime_type, field_name})=>{
    const file_path = path.resolve(folder_path, file_name);
    if(!fs.existsSync(file_path)){
        return FileApiErrors.FILE_NOT_EXISTS;
    }
    const file_id = uuid.v4();
    const extension = mimes.extension(mime_type);
    const options = __options_generator({key:`${file_id}.${extension}`, file_path:file_path});
    const _bucket = await get_bucked();
    const upload = await _bucket.upload(options).promise();
    console.log("FILE UPLOADED:", {upload});

    await Clean_up({file_path})
    return {file_id, field_name};
}

const Downloader = async({key="", response_type="image/png", expires_min=30})=>{
    const _bucket = await get_bucked();
    const content_type = response_type == "image" ? "image/png" : "video/mp4";
    //Signed Url
    const content_url = await _bucket.getSignedUrlPromise('getObject', {
        Bucket: env("AWS_BUCKET_NAME"),
        Key: key,
        Expires: 60*expires_min,
        ResponseContentType: response_type,
    });
    console.log(`AWS Signed URL: ${content_url}`);
    return content_url;

}


const __options_generator = ({bucket, key, file_path}) =>{
    return {
        Bucket: env("AWS_BUCKET_NAME", bucket),
        Key: key,
        Body: fs.readFileSync(file_path),
    };
}

const Clean_up = async ({file_path}) => {
    return new Promise((resolve) => {
        fs.unlink(file_path, () => {
            resolve(true);
        })
    })
}

module.exports = {FileAPI:{Uploader, Downloader, Clean_up}}