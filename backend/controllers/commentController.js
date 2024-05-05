const path = require("path");
const fileSystem = require('fs');
const { upload } = require('../controllers/fileStorage.js');

const __dpath = path.resolve();



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
    const commentFile = fileSystem.readFileSync(__dpath + '/models/comment.json', 'utf8');
    let comments = JSON.parse(commentFile);
    const comment = comments;
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
        const postFile = fileSystem.readFileSync(__dpath + '/models/post.json', 'utf8');
        let posts = JSON.parse(postFile);
        const post = posts;
        const editpost = [];
        for (let i = 0; i < post.length; i++) {
            if (post[i].post_id == parseInt(post_id)) {
                const postData = {
                    post_id: post[i].post_id,
                    post_title: post[i].post_title,
                    post_content: post[i].post_content,
                    file_id: 1,
                    user_id: post[i].user_id,
                    nickname: post[i].nickname,
                    created_at: post[i].created_at,
                    like: post[i].like,
                    comment_count: post[i].comment_count+1,
                    hits: post[i].hits,
                    file_path: post[i].file_path,
                    profile_image_path: post[i].profile_image_path
                };
                editpost.push(postData);
            } else {
                editpost.push(post[i]);
            }
        }
        const newPost = JSON.stringify(editpost);
        fileSystem.writeFileSync(__dpath + '/models/post.json', newPost, 'utf8');

        let postId = 0;
        if(post.length > 0) {
            postId = parseInt(post[post.length - 1].post_id) + 1;
        }
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

function deleteComment(req, res) {
    const postFile = fileSystem.readFileSync(__dpath + '/models/post.json', 'utf8');
    let posts = JSON.parse(postFile);
    const post = posts;
    const editpost = [];
    const post_id = req.params.postId;
    for (let i = 0; i < post.length; i++) {
        if (post[i].post_id == parseInt(post_id)) {
            const postData = {
                post_id: post[i].post_id,
                post_title: post[i].post_title,
                post_content: post[i].post_content,
                file_id: 1,
                user_id: post[i].user_id,
                nickname: post[i].nickname,
                created_at: post[i].created_at,
                like: post[i].like,
                comment_count: post[i].comment_count-1,
                hits: post[i].hits,
                file_path: post[i].file_path,
                profile_image_path: post[i].profile_image_path
            };
            editpost.push(postData);
        } else {
            editpost.push(post[i]);
        }
    }
    const newPost = JSON.stringify(editpost);
    fileSystem.writeFileSync(__dpath + '/models/post.json', newPost, 'utf8');

    const dcommentFile = fileSystem.readFileSync(__dpath + '/models/comment.json', 'utf8');
    let dcomments = JSON.parse(dcommentFile);
    const dcomment = dcomments;
    const comment_id = req.params.commentId;
    const editcomment = [];
        for (let i = 0; i < dcomment.length; i++) {
            if (dcomment[i].comment_id == comment_id) {
                console.log(comment_id+"댓글 삭제");
            } else {
                editcomment.push(dcomment[i]);
            }
        }
        console.log(editpost);
        const newComment = JSON.stringify(editcomment);
        fileSystem.writeFileSync(__dpath + '/models/comment.json', newComment, 'utf8');
        res.status(200).json({message: "delete_comment_success"});
}

module.exports = {
    getComments,
    createComment,
    deleteComment
};
