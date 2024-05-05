window.onload = async function () {
  const globalData = await getUserNameById();
  console.log(globalData);

  const headerList = document.getElementById("header");
  const header_div = document.createElement("div");
  header_div.classList.add("header");
  header_div.innerHTML = `
            <div class="header-left">
            <a href="javascript:history.back()">
            <p class="line-1"></p>
            <p class="line-2"></p>
            </a>
        </div>
        <p>아무 말 대잔치</p>
        <div class="header-right-overlay">
            <span class="mtp10"
            ><img
                src="http://localhost:3065/${globalData.profile_image_path}"
                class="header-right"
            /></span>
            <div class="header-right-board">
            <p><a href="/users/${globalData.user_id}">회원정보수정</a></p>
            <p><a href="/users/${globalData.user_id}/password">비밀번호수정</a></p>
            <p><a href="/">로그아웃</a></p>
            </div>
        </div>
    `;
  headerList.appendChild(header_div);

  const currentUrl = window.location.href;
  const postId = currentUrl.split("/").pop();
  fetch("http://localhost:3065/posts/" + postId)
    .then((Response) => {
      if (!Response.ok) {
        throw new Error("netword");
      }
      return Response.json();
    })
    .then((data) => {
      const viewPost = document.getElementById("view-post");
      data.forEach((kkk) => {
        if (kkk.post_id == postId) {
          console.log(kkk.post_id);
          console.log(kkk.file_path);
          const div = document.createElement("div");
          div.innerHTML = `
            <h3>${kkk.post_title}</h3>
            <div class="view-writer">
              <div class="view-writer sub">
                <img
                  src="http://localhost:3065/${kkk.profile_image_path}"
                  class="header-right"
                />
                <h4 class="mlp10">${kkk.nickname}</h4>
                <p class="mlp30">${kkk.created_at.replace(/[TZ.]/g, " ")}</p>
              </div>
              <div class="view-writer sub">
                <form action="/posts/${kkk.post_id}" method="post">
                  <button class="edit-btn" style="margin-right: 10px" id="edit-btn">수정</button>
                </form>
                <button class="edit-btn" id="bbs" onclick="modalView('bbs')">삭제</button>
                <div class="modal hidden" id="modal_bbs">
                  <div class="modal_overlay"></div>
                  <div class="modal_content">
                    <h2>게시글을 삭제하시겠습니까?</h2>
                    <h4>삭제한 내용은 복구할 수 없습니다.</h4>
                    <button style="background-color: black; width: 100px; height: 50px; border-radius: 10px; border: 0"><p style="color: white;">취소</p></button>
                    <button style="background-color: #aca0eb; width: 100px; height: 50px; border-radius: 10px; border: 0" onclick="deletePost(${kkk.post_id})">확인</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr class="board-line" />
          <div class="board-cont">
            <img
              src="http://localhost:3065/${kkk.file_path}"
              class="view-file"
            />
            <p>
              ${kkk.post_content}
            </p>
            <div style="display: flex; justify-content: center">
              <button class="view-container-btn"><span id="cutNum">${kkk.hits}</span><br />조회수</button>
              <button class="view-container-btn"><span id="cutNum">${kkk.comment_count}</span><br />댓글</button>
            </div>
            `;
          viewPost.appendChild(div);
        }
      });
      cutNum();
    })
    .catch((error) => {
      console.error("error", error);
    });
  fetch("http://localhost:3065/posts/" + postId + "/comments")
    .then((Response) => {
      if (!Response.ok) {
        throw new Error("net");
      }
      return Response.json();
    })
    .then((data) => {
      const commentPost = document.getElementById("view-comment");
      data.forEach((kkk) => {
        if (postId == kkk.post_id) {
          const div = document.createElement("div");
          div.innerHTML = `
            <div class="view-writer">
              <div style="display: flex; flex-direction: column">
                <div class="view-writer sub">
                  <img
                    src="http://localhost:3065/${kkk.profile_image_path}"
                    class="header-right"
                  />
                  <h4 style="margin-left: 10px">${kkk.nickname}</h4>
                  <p style="margin-left: 30px">${kkk.created_at}</p>
                </div>
                <div>${kkk.content}</div>
              </div>
              <div class="view-writer sub">
                <button class="edit-btn" style="margin-right: 10px" onclick="changeEdit(${kkk.comment_id}, '${kkk.content.replace(/\s+/g, "")}')">수정</button>
                <button
                  class="edit-btn"
                  id="comment-del_${kkk.comment_id}"
                  onclick="modalView('comment-del_${kkk.comment_id}')"
                >
                  삭제
                </button>
                <div class="modal hidden" id="modal_comment-del_${kkk.comment_id}">
                  <div class="modal_overlay"></div>
                  <div class="modal_content">
                    <h2>댓글을 삭제하시겠습니까?</h2>
                    <h4>삭제한 내용은 복구할 수 없습니다.</h4>
                    <button
                      style="
                        background-color: black;
                        width: 100px;
                        height: 50px;
                        border-radius: 10px;
                        border: 0;
                      "
                    >
                      <p style="color: white">취소</p>
                    </button>
                    <button
                      style="
                        background-color: #aca0eb;
                        width: 100px;
                        height: 50px;
                        border-radius: 10px;
                        border: 0;
                      "
                      onclick="deleteComment(${kkk.comment_id})"
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            </div>
            `;
          commentPost.appendChild(div);
        }
      });
    })
    .catch((error) => {
      console.error("error", error);
    });
};

function cutNum() {
  //const element = document.getElementById('cutNum');
  const element = document.querySelectorAll("#cutNum");
  for (let i = 0; i < element.length; i++) {
    const num = parseInt(element[i].textContent);
    if (num >= 1000) {
      let digit = num / 1000;
      element[i].textContent = digit + "k";
    }
  }
}

async function send_comment() {
  const comment_user = await getUserNameById();
  const currentUrl = window.location.href;
  const post_id = currentUrl.split("/").pop();
  const formDataString = `post_id=${post_id}&content=${encodeURIComponent(document.getElementById("textarea-input").value)}
    &nickname=${comment_user.nickname}&profilePath=${comment_user.profile_image_path}&comment_id=-1`;
  console.log(comment_user.nickname);
  console.log(comment_user.profile_image_path);
  fetch("http://localhost:3065/posts/" + post_id + "/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formDataString,
  })
    .then((Response) => {
      if (!Response.ok) {
        throw new Error("netword");
      }
      alert("댓글이 등록되었습니다");
      location.reload();
      return Response.json();
    })
    .then((data) => {})
    .catch((error) => {
      console.error("error", error);
    });
}

function changeEdit(comment_id, content) {
  document.getElementById("comment-btn").style.display = "none"; // 댓글 등록 버튼 숨기기
  const editButton = document.getElementById("edit-comment-btn");
  editButton.style.display = "block"; // 버튼을 보이게 만듭니다.
  document.getElementById("textarea-input").value = content;
  editButton.onclick = edit_comment.bind(null, comment_id);
}
function edit_comment(comment_id) {
  const currentUrl = window.location.href;
  const post_id = currentUrl.split("/").pop();
  const formDataString = `post_id=${post_id}&content=${encodeURIComponent(document.getElementById("textarea-input").value)}
    &nickname=blank&profilePath=blank&comment_id=${comment_id}`;
  fetch("http://localhost:3065/posts/" + post_id + "/comments/" + comment_id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formDataString,
  })
    .then((Response) => {
      if (!Response.ok) {
        throw new Error("netword");
      }
      alert("댓글이 수정되었습니다");
      location.reload();
      return Response.json();
    })
    .then((data) => {})
    .catch((error) => {
      console.error("error", error);
    });
}

function modalView(id) {
  const openButton = document.getElementById(id);
  const modal = document.querySelector("#modal_" + id);
  const overlay = modal.querySelector(".modal_overlay");
  const closeBtn = modal.querySelector("button");
  const openModal = () => {
    modal.classList.remove("hidden");
  };
  const closeModal = () => {
    modal.classList.add("hidden");
  };
  overlay.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  openButton.addEventListener("click", openModal);
}

async function getUserNameById() {
  try {
    const response = await fetch("http://localhost:3065/header", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("there", error);
    return null;
  }
}

function deletePost(post_id) {
  fetch("http://localhost:3065/posts/" + post_id, {
    method: "DELETE",
    body: post_id,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.status);
      if (response.status === 200) {
        window.location.href = "/posts";
      }
      return response.json();
    })
    .then((data) => {
      alert("게시글 삭제 완료");
    });
  return false;
}

function deleteComment(comment_id) {
  const currentUrl = window.location.href;
  const post_id = currentUrl.split("/").pop();
  fetch("http://localhost:3065/posts/" + post_id + "/comments/" + comment_id, {
    method: "DELETE",
    body: post_id,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(response.status);
      if (response.status === 200) {
        location.reload();
      }
      return response.json();
    })
    .then((data) => {
      alert("댓글 삭제 완료");
    });
  return false;
}
