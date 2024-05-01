const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');

const __dpath = path.resolve();

const commentFile = fileSystem.readFileSync(__dpath + '/models/comment.json', 'utf8');
let comments = JSON.parse(commentFile);
const comment = comments;

function getComments(req, res) {
    fileSystem.readFile(__dpath + '/models/comment.json', 'utf8', (err, data) => {
        if (err) {
            console.log('error comment.json read', err);
            return;
        }
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    });
};

function createComment(req, res) {
    const post_id = req.body.post_id;
    const content = req.body.content;
    const nickname = req.body.nickname;
    const profilePath = req.body.profilePath;
    const comment_id = req.body.comment_id;

    //댓글 수정
    if(comment_id > -1) {
        const editcomment = [];
        for (let i = 0; i < comment.length; i++) {
            if (comment[i].comment_id == comment_id) {
                const commentData = {
                    comment_id: comment_id,
                    post_id: parseInt(post_id),
                    content: content,
                    nickname: comment[i].nickname,
                    created_at: new Date(),
                    profile_image_path: comment[i].profile_image_path
                };
                //FIXME: 수정 파일등록 안할시 이미지 사라지는 오류
                editcomment.push(commentData);
            } else {
                editcomment.push(comment[i]);
            }
        }
        const newComment = JSON.stringify(editcomment);
        fileSystem.writeFileSync(__dpath + '/models/comment.json', newComment, 'utf8');
        res.status(200).send('success');
    } else {
        let commentId = parseInt(comment[comment.length - 1].comment_id) + 1;

        const commentData = {
            comment_id: commentId,
            post_id: parseInt(post_id),
            content: content,
            nickname: nickname,
            created_at: new Date(),
            profile_image_path: profilePath
        };
        comment.push(commentData);
        const newComment = JSON.stringify(comment);
        fileSystem.writeFileSync(__dpath + '/models/comment.json', newComment, 'utf8');
        res.status(200).send('success');
    }
}


module.exports = {
    getComments,
    createComment
};
