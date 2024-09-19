const convert = require('heic-convert')

async function convertToJPG(file) {
    return await convert({
        buffer: file,
        format: "JPEG",
        quality: 1,
    })
}

module.exports = convertToJPG