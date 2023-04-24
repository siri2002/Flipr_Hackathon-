const http = require('http');
const express = require('express')
const path = require('path');
const app = express()
const request = require("request");
const querystring = require('querystring');
const FieldValue = require('firebase-admin').firestore.FieldValue;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./serviceAccountKey.json");
const { name } = require('ejs');

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")

app.use(express.static("public"));

app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

app.get('/', (req, res) => {
    res.render("welcome")
})

app.get('/signup', (req, res) => {
    res.render("signup")
});
app.get('/registersubmit', (req, res) => {
    const username = req.query.username;//use name same name as given in form
    const name = req.query.name;
    const password = req.query.password;
    const repassword = req.query.repassword;
    console.log(username);
    console.log(name);
    if (password === repassword) {
        db.collection("songusers")
            .add({
                name: name,
                username: username,
                password: password,
            })
            .then(() => {
                res.render("loginpage")
            });
    } else {
        res.send("<center><h1 style=\"padding-top: 20%\">PASSWORD AND RE-ENTER PASSWORD SHOULD BE SAME</h1></center>")
    }



});

app.get('/loginpage', (req, res) => {
    res.render("loginpage")
})
app.get('/playlist1', (req, res) => {
    res.render("playlist1")
})
app.get('/playlist2', (req, res) => {
    res.render("playlist2")
})
app.get('/loginsubmit', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    db.collection("songusers")
        .where("username", "==", email)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if (docs.size > 0) {
                res.render("home");
            }
            else {
                res.render("signup");
            }
        });
});




app.get('/welcome', function (req, res) {
    res.render("welcome");

});







const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})