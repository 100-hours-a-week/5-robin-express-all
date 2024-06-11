window.onload = async () => {
  const globalData = await getUserNameById();
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
                src="http://localhost:3065/${globalData.data.profile_path}"
                class="header-right"
            /></span>
            <div class="header-right-board">
            <p><a href="/users/${globalData.data.id}">회원정보수정</a></p>
            <p><a href="/users/${globalData.data.id}/password">비밀번호수정</a></p>
            <p><a href="/">로그아웃</a></p>
            </div>
        </div>
    `;
  headerList.appendChild(header_div);

  const currentUrl = window.location.href;
  const postId = currentUrl.split("/").pop();
  const viewResponse = await fetch("http://localhost:3065/posts/" + postId, {
    method: 'GET',
  });
  if(!viewResponse.ok) {
    throw new Error("게시물 불러오기 오류");
  }
  if(viewResponse.status === 200) {
    const viewPost = document.getElementById("view-post");
    const jsonData = await viewResponse.json();
    const data = jsonData.data;
    const kkk = data[0];
    const originalDateStr = kkk.created_at;
    // Date 객체로 변환
    const date = new Date(originalDateStr);

    // UTC 기준으로 년, 월, 일, 시간, 분, 초를 추출
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // 원하는 형식으로 조합
    const formattedDateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const div = document.createElement("div");
        div.innerHTML = `
        <h3>${kkk.title}</h3>
        <div class="view-writer">
            <div class="view-writer sub">
            <img
                src="http://localhost:3065/${kkk.profile_path}"
                class="header-right"
            />
            <h4 class="mlp10">${kkk.nickname}</h4>
            <p class="mlp30">${formattedDateStr}</p>
            </div>
            <div class="view-writer sub">
            <form action="/posts/${kkk.id}" method="post">
                <button class="edit-btn" style="margin-right: 10px" id="edit-btn">수정</button>
            </form>
            <button class="edit-btn" id="bbs" onclick="modalView('bbs')">삭제</button>
            <div class="modal hidden" id="modal_bbs">
                <div class="modal_overlay"></div>
                <div class="modal_content">
                <h2>게시글을 삭제하시겠습니까?</h2>
                <h4>삭제한 내용은 복구할 수 없습니다.</h4>
                <button style="background-color: black; width: 100px; height: 50px; border-radius: 10px; border: 0"><p style="color: white;">취소</p></button>
                <button style="background-color: #aca0eb; width: 100px; height: 50px; border-radius: 10px; border: 0" onclick="deletePost(${kkk.id}, ${globalData.data.id})">확인</button>
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
            ${kkk.content}
        </p>
        <div style="display: flex; justify-content: center">
            <button class="view-container-btn"><span id="cutNum">${kkk.hits}</span><br />조회수</button>
            <button class="view-container-btn"><span id="cutNum">${kkk.comments}</span><br />댓글</button>
        </div>
        `;
        viewPost.appendChild(div);
    };
    cutNum();
    const cmtResponse = await fetch("http://localhost:3065/posts/" + postId+"/comments", {
        method: 'GET'
    });
    if(!cmtResponse.ok) {
        throw new Error("댓글 불러오기 오류");
    }
    if(cmtResponse.status === 200) {
        const commentPost = document.getElementById("view-comment");
        const jsonData = await cmtResponse.json();
        const cmtData = jsonData.data;
        for (const ckkk of cmtData) {
            const originalDateStr = ckkk.created_at;
            // Date 객체로 변환
            const date = new Date(originalDateStr);

            // UTC 기준으로 년, 월, 일, 시간, 분, 초를 추출
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            const seconds = String(date.getUTCSeconds()).padStart(2, '0');

            // 원하는 형식으로 조합
            const formattedDateStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            const div = document.createElement("div");
            div.innerHTML = `
                <div class="view-writer">
                <div style="display: flex; flex-direction: column">
                    <div class="view-writer sub">
                    <img
                        src="http://localhost:3065/${ckkk.profile_path}"
                        class="header-right"
                    />
                    <h4 style="margin-left: 10px">${ckkk.nickname}</h4>
                    <p style="margin-left: 30px">${formattedDateStr}</p>
                    </div>
                    <div>${ckkk.content}</div>
                </div>
                <div class="view-writer sub">
                    <button class="edit-btn" style="margin-right: 10px" onclick="changeEdit(${ckkk.id}, '${escapeContent(ckkk.content)}')">수정</button>
                    <button
                    class="edit-btn"
                    id="comment-del_${ckkk.id}"
                    onclick="modalView('comment-del_${ckkk.id}')"
                    >
                    삭제
                    </button>
                    <div class="modal hidden" id="modal_comment-del_${ckkk.id}">
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
                        onclick="deleteComment(${ckkk.id})"
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
    }
};

function escapeContent(content) {
    // 공백을 제거하고, 필요한 경우 이스케이프 처리
    return content.replace(/\s+/g, "");
}

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

const send_comment = async () => {
    const currentUrl = window.location.href;
    const post_id = currentUrl.split("/").pop();
    const formDataString = `post_id=${post_id}&content=${encodeURIComponent(document.getElementById("textarea-input").value)}`;
    try {
        const response = await fetch("http://localhost:3065/posts/" + post_id + "/comments", {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            credentials: "include",
            body: formDataString,
        });
        if(!response.ok) {
            throw new Error("댓글 등록 오류");
        }
        if(response.status === 201) {
            alert("댓글 등록 완료");
            window.location.reload();
        }
    } catch(e) {
        console.error(e);
    }
}

const edit_comment = async (comment_id) => {
    const currentUrl = window.location.href;
    const post_id = currentUrl.split("/").pop();
    const formDataString = `post_id=${post_id}&content=${encodeURIComponent(document.getElementById("textarea-input").value)}`;
    try {
        const response = await fetch("http://localhost:3065/posts/" + post_id + "/comments/" + comment_id, {
            method: "PATCH",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            credentials: "include",
            body: formDataString,
        });
        if(response.status === 401) {
            alert("댓글 수정 권한 없음");
        }
        if(!response.ok) {
            throw new Error("댓글 수정 오류");
        }
        if(response.status === 200) {
            alert("댓글 수정 완료");
            window.location.reload();
        }
    } catch(e) {
        console.error(e);
    }
}

function changeEdit(comment_id, content) {
  document.getElementById("comment-btn").style.display = "none"; // 댓글 등록 버튼 숨기기
  const editButton = document.getElementById("edit-comment-btn");
  editButton.style.display = "block"; // 버튼을 보이게 만듭니다.
  document.getElementById("textarea-input").value = content;
  editButton.onclick = edit_comment.bind(null, comment_id);
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
    return data;
  } catch (error) {
    console.error("there", error);
    return null;
  }
}

const deletePost = async (post_id, user_id) => {
    try {
        const response = await fetch("http://localhost:3065/posts/" + post_id, {
            method: "DELETE",
            body: JSON.stringify({ user_id }),
            credentials: "include",
          });

        if(response.status === 401) {
            alert("삭제 권한 없음");
        }
        if(!response.ok) {
            throw new Error("게시물 삭제 오류");
        }
        if(response.status === 200) {
            alert("게시글 삭제 완료");
            window.location.href = "/posts";
        }
    } catch(e) {
        console.error(e);
    }
}

const deleteComment = async (comment_id) => {
    const currentUrl = window.location.href;
    const post_id = currentUrl.split("/").pop();
    try {
        const response = await fetch("http://localhost:3065/posts/" + post_id + "/comments/" + comment_id, {
            method: "DELETE",
            body: post_id,
            credentials: "include",
          });
        if(response.status === 403) {
            alert("댓글 삭제 권한 없음");
        }
        if(!response.ok) {
            throw new Error("댓글 삭제 오류");
        }
        if(response.status === 200) {
            alert("댓글 삭제 완료");
            window.location.reload();
        }
    } catch(e) {
        console.error(e);
    }
}

