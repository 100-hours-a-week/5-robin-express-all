window.onload = async () => {
  //해더부분
  try {

    const headResponse = await fetch("http://localhost:3065/header", {
      method: "GET",
      credentials: "include",
    });

    if (!headResponse.ok) {
      throw new Error("헤더 불러오기 실패");
    }

    if (headResponse.status === 200) {
      const data = await headResponse.json();
      const headerList = document.getElementById("header");
      const div = document.createElement("article");
      div.classList.add("header");
      div.innerHTML = `
        <div style="width: 70px; height: 100%"></div>
        <span>아무 말 대잔치</span>
        <div class="header-right-overlay">
          <span class="mtp10">
            <img src="http://localhost:3065/${data.data.profile_path}" class="header-right" />
          </span>
          <div class="header-right-board">
            <p><a href="/users/${data.data.id}">회원정보수정</a></p>
            <p><a href="/users/${data.data.id}/password">비밀번호수정</a></p>
            <p><a href="/">로그아웃</a></p>
          </div>
        </div>
      `;
      headerList.appendChild(div);
    }
    const postData = await fetch("http://localhost:3065/posts", {
        method: "GET",
       credentials: "include",
    });
    if(!postData.ok) {
        throw new Error("목록 불러오기 실패");
    }
    if(postData.status === 200) {
        const jsonData = await postData.json();
        const data = jsonData.data;

        const postList = document.getElementById("post-list");
        data.forEach(kkk => {
            console.log(kkk);
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
            div.classList.add("content");
            div.innerHTML = `
                        <a href="/posts/${kkk.id}">
                        <h4 id="list-subject">${kkk.title}</h4>
                        </a>
                        <div class="date">
                            <p>좋아요 <span id="cutNum">${kkk.likes}</span> 댓글 <span id="cutNum">${kkk.comments}</span> 조회수 <span id="cutNum">${kkk.hits}</span></p>
                            <p>${formattedDateStr}</p>
                        </div>
                        <hr class="line">
                        <div style="display: flex; align-items: center;">
                            <img src="http://localhost:3065/${kkk.profile_path}" class="header-right">
                            <span style="align-items: center; margin-left: 10px">${kkk.nickname}</span>
                        </div>
                        `;
            postList.appendChild(div);
          });
          cutSubject();
          cutNum();
    }
  } catch(e) {
    console.error(e);
  }
  
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
