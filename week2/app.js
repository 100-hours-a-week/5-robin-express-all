import express, { response } from "express";
import path from "path";
const app = express();
const __dirname = path.resolve();

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("실행");
});

//로그인
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.post("/users/login", (req, res) => {
  /*
  res.status(200).json({
    message: "login_success",
    data: [{
      userId: 1,
      email: "test@test.kr"
    }]
  });
  */
  res.redirect("/posts?offset=0&limit=0");
});

app.get("/posts", (req, res) => {
  res.sendFile(__dirname + "/list.html");
});

app.get("/posts/:postId", (req, res) => {
  res.sendFile(__dirname + "/view.html");
});

app.post("/posts", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});
app.post("/posts/:postId", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

app.get("/member/1", (req, res) => {
  res.sendFile(__dirname + "/member.html");
});

app.get("/member/1/password", (req, res) => {
  res.sendFile(__dirname + "/member_edit.html");
});

app.get("/users/signup", (req, res) => {
  res.sendFile(__dirname + "/signin.html");
});
app.post("users/signup", (req, res) => {
  res.redirect("/posts?offset=0&limit=0");
});

app.get("/modal", (req, res) => {
  res.sendFile(__dirname + "/board_delete.html");
});
