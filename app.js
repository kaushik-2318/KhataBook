const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs')

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (req, res) {
    fs.readdir(`./files`, function (err, files) {
        if (err) return res.status(500).send(err);
        res.render("index", { files });
    })
})

app.get('/createhisaab', function (req, res) {
    res.render('create');
})

app.post('/create', function (req, res) {
    function getCurrentDateFormatted() {
        const currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        return `${day}-${month}-${year}`;
    }

    fs.writeFile(`./files/${getCurrentDateFormatted()}.txt`, `${req.body.hisab}`, (err) => {
        if (err) return res.status(500).send(err);
    })

    res.redirect('/')
})

app.get('/view/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
        if (err) return res.status(500).send(err);;
        res.render('view', { filename: req.params.filename, data })
    })
})

app.get('/edit/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function (err, data) {
        if (err) return res.status(500).send(err);;
        res.render('edit', { filename: req.params.filename, data })
    })
})


app.post('/update/:filename', function (req, res) {
    fs.writeFile(`./files/${req.params.filename}`, req.body.updatedfiledata, function (err, data) {
        if (err) return res.status(500).send(err);;
        res.redirect('/')
    })
})

app.get('/delete/:filename', function (req, res) {
    fs.unlink(`./files/${req.params.filename}`, function (err) {
        if (err) return res.status(500).send(err);;
        res.redirect('/')
    })
})
app.listen(3000);