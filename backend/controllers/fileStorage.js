// fileStorage.js

import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/userImg'); // 파일 저장 경로 지정
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // 파일 이름 지정
    }
});

export const upload = multer({ storage: storage });
