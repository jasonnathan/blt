'use strict';
const fetch = require('node-fetch');

/**
 * Since this is specific to jsonplaceholder, better to put it in its own function
 *
 * @param  {Number} id The numerical ID of the comment
 * @return {Promise}   Returns a thenable with the response data
 */
const fetchComment = (id) => {
  if(isNaN(+id)){
    return Promise.reject(new TypeError("JSONPlaceholder service only returns data for numeric ids"))
  }
  return fetch(`https://jsonplaceholder.typicode.com/comments/${id}`);
}

module.exports = fetchComment;
