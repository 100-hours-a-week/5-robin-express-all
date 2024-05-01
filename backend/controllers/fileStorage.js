const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/userImg/'); // 파일 저장 경로 지정
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 지정
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };
