const path = require('path');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const baseDir = path.resolve();

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        
        if (!isValid) {
            const uploadError = new Error('Invalid image type');
            return callback(uploadError);
        }

        callback(null, baseDir + '/public/uploads')
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname.replace(' ', '-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        callback(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const uploads = multer({ storage: storage })

module.exports = { uploads };