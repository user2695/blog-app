const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

//
const mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "user",
  database: "blogdatabase",
  multipleStatements: true,
});
mysqlConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to sql");
});
//

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//For creating a blog
app.post("/addblog", function (req, res) {
  let blg = req.body;
  var sql =
    "set @id=?; set @title=?; set @content=?;\
    call blogAddOrEdit(@id, @title,@content);";
  mysqlConnection.query(
    sql,
    [blg.id, blg.title, blg.content],
    function (err, rows, fields) {
      if (!err)
        rows.array.forEach((element) => {
          if (element.constructor == Array)
            res.send("Inserted blog id: " + element[0].id);
        });
      else console.log(err);
    }
  );
});

//For reading all blogs
app.get("/blogs", (req, res) => {
  mysqlConnection.query("select * from blogs", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

//For reading a single blog
app.get("/blogs/:id", (req, res) => {
  mysqlConnection.query(
    "select * from blogs where id=?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send(rows);
      else console.log(err);
    }
  );
});

//Update Record
app.put("/blogs", (req, res) => {
  let blg = req.body;
  var sql =
    "set @id=?; set @title=?; set @content=?;\
    call blogAddOrEdit(@id, @title,@content);";
  mysqlConnection.query(
    sql,
    [blg.id, blg.title, blg.content],
    function (err, rows, fields) {
      if (!err) res.send("Updated Successfully");
      else console.log(err);
    }
  );
});

//For deleting a blog
app.delete("/blogs/:id", (req, res) => {
  mysqlConnection.query(
    "delete from blogs where id=?",
    [req.params.id],
    (err, rows, fields) => {
      if (!err) res.send("Record deleted successfully");
      else console.log(err);
    }
  );
});

app.listen(3000, () => {
  console.log("Running on: 3000");
});
