// TOKEN BLACKLIST 

// When a user logs outerHeight, their token is added to this set
// The authenticate middleware checks every incoming token against this list

// This is an in-memory store - it resets on every server restart 
// in production with multiple server instances, use a shared store like redis 
// with a TTL matching the tokens expiry (7d) so entries are auto-purged.

const blacklist = new Set();

module.exports = blacklist