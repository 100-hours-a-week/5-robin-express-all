window.onload = function () {
  //해더부분
  fetch("http://localhost:3065/header", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const headerList = document.getElementById("header");
      const div = document.createElement("article");
      div.classList.add("header");
      div.innerHTML = `
                <div style="width: 70px; height: 100%"></div>
                <span>아무 말 대잔치</span>
                <div class="header-right-overlay">
                    <span class="mtp10"
                    ><img
                        src="http://localhost:3065/${data.profile_image_path}"
                        class="header-right"
                    /></span>
                    <div class="header-right-board">
                    <p><a href="/users/${data.user_id}">회원정보수정</a></p>
                    <p><a href="/users/${data.user_id}/password">비밀번호수정</a></p>
                    <p><a href="/">로그아웃</a></p>
                    </div>
                </div>
                `;
      headerList.appendChild(div);
    })
    .catch((error) => {
      console.error("there", error);
    });

  fetch("http://localhost:3065/posts", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const postList = document.getElementById("post-list");
      data.forEach((kkk) => {
        console.log(kkk);
        const div = document.createElement("div");
        div.classList.add("content");
        div.innerHTML = `
                    <a href="/posts/${kkk.post_id}">
                    <h4 id="list-subject">${kkk.post_title}</h4>
                    </a>
                    <div class="date">
                        <p>좋아요 <span id="cutNum">${kkk.like}</span> 댓글 <span id="cutNum">${kkk.comment_count}</span> 조회수 <span id="cutNum">${kkk.hits}</span></p>
                        <p>${kkk.created_at.replace(/[TZ.]/g, " ")}</p>
                    </div>
                    <hr class="line">
                    <div style="display: flex; align-items: center;">
                        <img src="http://localhost:3065/${kkk.profile_image_path}" class="header-right">
                        <span style="align-items: center; margin-left: 10px">${kkk.nickname}</span>
                    </div>
                    `;
        postList.appendChild(div);
      });
      cutSubject();
      cutNum();
    })
    .catch((error) => {
      console.error("there", error);
    });
};

function cutSubject() {
  const sub = document.getElementById("list-subject");
  const element = document.querySelectorAll("#list-subject");
  for (let i = 0; i < element.length; i++) {
    if (element[i].textContent.length > 26) {
      element[i].textContent = element[i].textContent.slice(0, 26) + "...";
    }
  }
}

function cutNum() {
  //const element = document.getElementById('cutNum');
  const element = document.querySelectorAll("#cutNum");
  for (let i = 0; i < element.length; i++) {
    console.log(element[i].textContent);
    const num = parseInt(element[i].textContent);
    if (num >= 1000) {
      let digit = num / 1000;
      element[i].textContent = digit + "k";
    }
  }
}
