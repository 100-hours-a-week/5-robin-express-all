window.onload = async function () {
    const currentUrl = window.location.href;
    const postId = currentUrl.split("/").pop();
    const writePost = document.getElementById("write-post");
    const div = document.createElement("div");
    const filename = '';
    
    //해더부분
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
            <p><a href="/member/${globalData.user_id}">회원정보수정</a></p>
            <p><a href="/member/${globalData.user_id}/password">비밀번호수정</a></p>
            <p><a href="/">로그아웃</a></p>
            </div>
        </div>
    `;
    headerList.appendChild(header_div);

    if (postId === "new") {
      console.log("게시글 작성");
      div.innerHTML = `
        <input type="hidden" name="edit_id" value=-1>
        <input type="hidden" name="fileid" value=22>
        <input type="hidden" name="userid" value=${globalData.user_id}>
        <input type="hidden" name="nickname" value="${globalData.nickname}">
        <input type="hidden" name="profilePath" value="${globalData.profile_image_path}">
        <input type="hidden" name="like" value=0>
        <input type="hidden" name="comment_count" value=0>
        <input type="hidden" name="hits" value=0>
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
    } else {
      console.log("게시글 수정");
      fetch("http://localhost:3065/posts/"+postId)
        .then((Response) => {
          if (!Response.ok) {
            throw new Error("network");
          }
          return Response.json();
        })
        .then((data) => {
          data.forEach((kkk) => {
            if (kkk.post_id == postId) {
              div.innerHTML = `
                <input type="hidden" name="edit_id" value=${kkk.post_id}>
                <input type="hidden" name="fileid" value=22>
                <input type="hidden" name="userid" value=22>
                <input type="hidden" name="nickname" value="글작성처음">
                <input type="hidden" name="profilePath" value="/image/fdfdf.jpg">
                <input type="hidden" name="like" value=0>
                <input type="hidden" name="comment_count" value=0>
                <input type="hidden" name="hits" value=0>
                <h3 style="text-align: center">게시글 작성</h3>
                <p>제목*</p>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="제목을 입력해주세요.(최대 26글자)"
                  class="form-control2"
                  maxlength="26"
                  value="${kkk.post_title}"
                />
                <p class="mtp30">내용*</p>
                <textarea
                  id="content"
                  name="content"
                  class="form-control2-textarea"
                  placeholder="내용을 입력해주세요"
                >${kkk.post_content}</textarea>
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
              
                const fileInput = document.querySelector('input[type="file"]');

                // Create a new File object
                const myFile = new File(['Hello World!'], kkk.file_path, {
                    type: 'text/plain',
                    lastModified: new Date(),
                });

                // Now let's create a DataTransfer to get a FileList
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(myFile);
                fileInput.files = dataTransfer.files;

                document.getElementById("content").addEventListener('input', () => {
                const context = document.getElementById('content').value;
                if(context == '') {
                  document.getElementById("send-btn").style.backgroundColor =
                  "#aca0eb";
                  document.getElementById("helper-text").textContent = "제목 내용을 모두 작성해주세요.";
                } else {
                  document.getElementById("send-btn").style.backgroundColor =
                  "#7F6AEE";
                  document.getElementById("helper-text").textContent = "";
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("error", error);
        });
    }

    document.getElementById("content").addEventListener('input', () => {
      const context = document.getElementById('content').value;
      if(context == '') {
        document.getElementById("send-btn").style.backgroundColor =
        "#aca0eb";
        document.getElementById("helper-text").textContent = "제목 내용을 모두 작성해주세요.";
      } else {
        document.getElementById("send-btn").style.backgroundColor =
        "#7F6AEE";
        document.getElementById("helper-text").textContent = "";
      }
    });
    function checkContentarea() {
      const subject = document.getElementById("subject").value;
      const content = document.getElementById("content").value;
      if (subject.trim() !== "" && content.trim() !== "") {
        document.getElementById("send-btn").style.backgroundColor =
          "#7F6AEE";
      } else {
        document.getElementById("send-btn").style.backgroundColor =
          "#aca0eb";
      }
    }
  };

  function board_sendit() {
    let form = document.getElementById("bbs_Form");
    let subject = form.subject.value;
    let content = form.content.value;
    if (subject == "" || content == "") {
      alert("제목, 내용을 모두 작성해주세요.");
      return false;
    } else {
      document.getElementById("send-btn").style.backgroundColor = "#7F6AEE";
      const file = document.getElementById("imgFile").files[0];
      const formData = new FormData();
      formData.append('image', file);
      fetch('http://localhost:3065/posts/upload/attach-file', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            const messageInput = document.createElement('input');
            messageInput.type = 'hidden';
            messageInput.name = 'imgfilePath';
            messageInput.value = data.message;
            console.log(data.message);
            form.appendChild(messageInput);
            alert("게시글 작성 완료");
            form.submit();
        })
        return false;
    }
  }

async function getUserNameById() {
    try {
        const response = await fetch("http://localhost:3065/header", {
            method: 'GET',
            credentials: 'include'
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