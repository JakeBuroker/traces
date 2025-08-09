const dotenv = require('dotenv');
dotenv.config();

const filterInArchiveMode = (req, res, next) => {
    const archive = process.env.ARCHIVE
    if (archive === 'true' ) res.sendStatus(503)
    else next()
}

module.exports = ({ filterInArchiveMode })