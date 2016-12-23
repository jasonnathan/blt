'use strict';

const fu = require('./fileUtils');
const fetchComment = require('./fetchComment');

const saveJSONFileInLambda = fu.saveJSONFileInLambda;
const saveFileToS3 = fu.saveFileToS3;
const getJSONFromS3 = fu.getJSONFromS3;

/**
 * The getComment function retrieves a comment from the JSON service using an
 * id that's given from the request.
 * It then saves the file locally, before calling an S3 function and saves it there
 */
module.exports.getComment = (event, context, callback) => {
  // extract the comment id from request
  const commentId = event.pathParameters.id;

  if (isNaN(+ commentId)) {
    return callback(new TypeError("JSONPlaceholder service only returns data for numeric ids"));
  }

  // the only generated uuid I see and it makes sense to use it too.
  // creating one abitarily doesn't tell you much about where it came from
  const uuid = event.requestContext.requestId;

  return fetchComment(commentId)
  // get json directly from request
  .then(res => res.json())
  // save the file locally in lambda
  .then(jsonString => saveJSONFileInLambda(uuid, jsonString, (err) => {
    if (err)
      return Promise.reject(err);

    return Promise.resolve({});
  }))
  // upload to s3
  .then(() => saveFileToS3(uuid, (err) => {
    if (err)
      return Promise.reject(err);

    return callback(null, {statusCode: 200})
  }))
  // catch errors and return
  .catch(err => callback(err));
};

/**
 * The comment parser listens on an S3 upload event, retrieves the file from S3
 * and then logs it out in a console.log (Cloudwatch logs)
 */
module.exports.commentParser = (event, context, callback) => {
  const data = event.Records[0].s3,
    bucket = data.bucket.name,
    key = data.object.key;
  return getJSONFromS3(bucket, key, (err, data) => {
    console.log(data)
  });
}
