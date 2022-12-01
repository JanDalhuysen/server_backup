const fs = require("fs");
const express = require("express");
const body_parser = require("body-parser");
const fetch = require("node-fetch");
const os = require("os");
const cors = require("cors");

const app = express();
const port = 5000;

var url_encoded_parser = body_parser.urlencoded({ extended: false });
var data = fs.readFileSync("weather.json");
var words = JSON.parse(data);

console.log(words);

app.use(cors({origin: "*"}));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("weather");
});

app.get("/weather", (req, res) => {
  res.sendFile(__dirname + "/words.json");
});

app.get("/tailwindcss.js", (req, res) => {
	res.sendFile(__dirname + "/tailwindcss.js");
});

app.get("/location.csv", (req, res) => {
	res.sendFile(__dirname + "/location.csv");
});

app.get("/home", (req, res) => {
  // res.render("home");
  async function test() {
    let data = await fetch("http://129.151.168.7/add/server/100");
    console.log(data);
  }
  test();
  res.send(`${Date.now()}`);
});

app.get("/weer/:temp", (req, res) => {
  let data = req.params;
  let temp = data.temp;
  const d = new Date();
  let time =
    d.getFullYear().toString() +
    "-" +
    d.getMonth().toString() +
    "-" +
    d.getDate().toString() +
    " " +
    d.getHours() +
    ":" +
    d.getMinutes();
  console.log(time);
  async function addData() {
    let tmp = await fetch(`http://129.151.168.7/add/${time}/${temp}`);
  }
  addData();
  res.send({ status: "success" });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", url_encoded_parser, function (req, res) {
  let name = req.body.name;
  let surname = req.body.surname;
  res.send(
    `<h1>Welcome ${name}</h1><p>We hope you enjoy your stay, ${name} ${surname}`
  );
  fs.writeFile(
    `${name}.json`,
    `[{ "name": "${name}", "surname": "${surname}" }]`,
    function (err) {
      if (err) throw err;
    }
  );
});

app.get("/add/:word/:score", addWord);

function addWord(req, res) {
  let data = req.params;
  let word = data.word;
	console.log(data.score);
  let score = Number(data.score);
  words[word] = score;
  console.log(words);
  let stringed = JSON.stringify(words, null, 2);
  fs.writeFile("words.json", stringed, done);
  function done() {
    console.log("done");
  }
  res.send({ message: "epic" });
}

app.listen(port, listening);

function listening() {
  console.log(`Listening on http://localhost:${port}`);
}
