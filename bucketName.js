/**
 * This is definitely a problem as bucket names need to be unique within regions
 * It might be possible to generate something that is a little more dynamic,
 * but that might affect other functions that depend on the bucket name.
 * The easiest way will be to pre-create a unqiue bucket name and have that be
 * the default bucket name to use.
 *
 * This WILL NOT WORK, but I'm following instructions in the test requirements.
 *
 * @type {String}
 */
module.exports.getBucketName = () => {
  return "inbox";
}
