window.onload = async () => {
  const currentUrl = window.location.href;
  const postId = currentUrl.split("/").pop();
  const writePost = document.getElementById("write-post");
  const div = document.createElement("div");
  const filename = "";

  //해더부분
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

  if (postId === "new") {
    console.log("게시글 작성");
    div.innerHTML = `
        <input type="hidden" name="post_id" value=-1>
        <input type="hidden" name="userid" value=${globalData.data.id}>
        <h3 style="text-align: center">게시글 작성</h3>
        <p>제목*</p>
        <input
          id="subject"
          type="text"
          name="subject"
          placeholder="제목을 입력해주세요.(최대 26글자)"
          class="form-control2"
          maxlength="26"
        />
        <p class="mtp30">내용*</p>
        <textarea
          id="content"
          name="content"
          class="form-control2-textarea"
          placeholder="내용을 입력해주세요"
        ></textarea>
        <p class="helper" id="helper-text">*제목 내용을 모두 작성해주세요.</p>
        <p>이미지*</p>
        <input type="file" id="imgFile" name="imgFile" style="margin-bottom: 40px" />
        <button
          class="send-btn mtp30"
          style="width: 70%; margin-left: 10%"
          id="send-btn"
        >
          <p>완료</p>
        </button>
      `;
    writePost.appendChild(div);
    document.getElementById("content").addEventListener("input", () => {
        const context = document.getElementById("content").value;
        if (context == "") {
          document.getElementById("send-btn").style.backgroundColor = "#aca0eb";
          document.getElementById("helper-text").textContent =
            "제목 내용을 모두 작성해주세요.";
        } else {
          document.getElementById("send-btn").style.backgroundColor = "#7F6AEE";
          document.getElementById("helper-text").textContent = "";
        }
      });
  } else {
    console.log("게시글 수정");
    const editData = await fetch("http://localhost:3065/posts/" + postId, {
        method: "GET",
    });
    if(!editData.ok) {
        throw new Error("수정데이터 불러오기 오류");
    }
    if(editData.status === 200) {
        const jsonData = await editData.json();
        const data = jsonData.data;
        const kkk = data[0];
        div.innerHTML = `
                <input type="hidden" name="post_id" value=${kkk.id}>
                <input type="hidden" name="userid" value=${globalData.data.id}>
                <h3 style="text-align: center">게시글 작성</h3>
                <p>제목*</p>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="제목을 입력해주세요.(최대 26글자)"
                  class="form-control2"
                  maxlength="26"
                  value="${kkk.title}"
                />
                <p class="mtp30">내용*</p>
                <textarea
                  id="content"
                  name="content"
                  class="form-control2-textarea"
                  placeholder="내용을 입력해주세요"
                >${kkk.content}</textarea>
                <p class="helper" id="helper-text"></p>
                <p>이미지*</p>
                <input type="file" id="imgFile" name="imgFile" style="margin-bottom: 40px" />
                
                <div>
                  <img src="http://localhost:3065/${kkk.file_path}" style=width:100%>
                </div>
                <button
                  class="send-btn mtp30"
                  style="width: 70%; margin-left: 10%; background-color: #7F6AEE"
                  id="send-btn"
                >
                  <p>완료</p>
                </button>
                `;
                writePost.appendChild(div);
            document
              .getElementById("subject")
              .addEventListener("input", checkContentarea);
            document
              .getElementById("content")
              .addEventListener("input", checkContentarea);
    }
  }
};

  
  function checkContentarea() {
    const subject = document.getElementById("subject").value;
    const content = document.getElementById("content").value;
    if (subject.trim() !== "" && content.trim() !== "") {
      document.getElementById("send-btn").style.backgroundColor = "#7F6AEE";
    } else {
      document.getElementById("send-btn").style.backgroundColor = "#aca0eb";
    }
  }

  document.getElementById("bbs_Form").addEventListener("submit", (event) => {
    event.preventDefault(); // form의 자동 제출을 막음
    board_sendit(); // fetch 요청 시작
  });

const board_sendit = async () => {
    let form = document.getElementById("bbs_Form");
    const post_id = form.post_id.value;
    const subject = form.subject.value;
    const content = form.content.value;
    const userid = form.userid.value;

    document.getElementById("send-btn").style.backgroundColor = "#7F6AEE";
    try {
        const file = document.getElementById("imgFile").files[0];
        const formData = new FormData();
        formData.append("image", file);
        const imgResponse = await fetch("http://localhost:3065/posts/upload/attach-file", {
            method: "POST",
            body: formData,
        });
        if(!imgResponse.ok) {
            throw new Error("이미지 업로드 실패");
        }
        if(imgResponse.status === 500) {
            throw new Error("이미지 업로드 실패");
        }

        let imgfilePath;
        if(imgResponse.status === 201) {
            const imgPath = await imgResponse.json();
            imgfilePath = imgPath.message;
        }

        const response = await fetch("http://localhost:3065/posts" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ post_id, subject, content, userid, imgfilePath }),
        });
        if(response.status === 500) {
            throw new Error("글쓰기 실패");
        }
        if(response.status === 401) {
            alert("수정 권한이 없습니다");
        }
        if(!response.ok) {
            throw new Error("글쓰기 실패");
        }
        if(response.status === 201) {
            alert("글쓰기 완료");
            window.location.href = "/posts";
        }
    } catch(e) {
        console.error(e);
    }
};

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
