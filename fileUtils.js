'use strict';

// core node module
const fs = require("fs");
// AWS is preloaded, no need to add to package.json to reduce deployment size
const AWS = require('aws-sdk');

/**
 * A simple method saves the file to disk whcih is lambda specific, saving to
 * /tmp, hence the separation and naming
 * @param  {String}   fileName The name of the file to save on disk
 * @param  {Object}   data     The parsed JSON data
 * @param  {Function} callback A nodejs style callback with (err, data)
 * @return {void}            Calls the callback with results
 */
const saveJSONFileInLambda = (fileName, data, callback) => {
  return fs.writeFile(`/tmp/${fileName}.json`, JSON.stringify(data), callback);
}

/**
 * Saves a file to S3 and calls the callback with the results
 * @param  {String}   fileName The name of the file (uuid)
 * @param  {Function} callback A Node style callbakc with error and data
 * @return {void}              Calls the the callback function with the results
 */
const saveFileToS3 = (fileName, callback) => {
  const Bucket = require('./bucketName').getBucketName(),
    s3 = new AWS.S3;

  return fs.readFile(`/tmp/${fileName}.json`, (err, Body) => {
    if (err) {
      return callback(err);
    }
    return s3.putObject({
      Bucket, Body, Key: `comments/${fileName}.json`,
    }, callback);
  });
}

/**
 * This method should take in the parameters directly from the request instead
 * of depending on the declared bucket, keeping it dependancy free
 *
 * @param  {String}   Bucket   The Bucket name of the stored ObjectCreated
 * @param  {String}   Key      The name of the file with prefix
 * @param  {Function} callback A node style callback with err and data
 * @return {void}              Calls the callback on error or success
 */
const getJSONFromS3 = (Bucket, Key, callback) => {
  const s3 = new AWS.S3;

  return s3.getObject({ Bucket, Key }, (err, data) => {
    if(err)
      return callback(err);

    return callback(null, JSON.parse(data.Body))
  });
}

module.exports = {
  saveJSONFileInLambda, saveFileToS3, getJSONFromS3
}
