const jwt = require('jsonwebtoken');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)
app.use(bodyParser.json())

let adminObj = {
    username: "Govind",
    role: 'admin',
    id: '645e4564c2cfaef834a78b87',
    updatedAt: '2023-05-12T13:58:39.348+00:00'
};
let userObj = {
    username: "John",
    role: 'user',
    id: '645e4564c2cfaef834a78ba1',
    updatedAt: '2023-06-12T13:55:48.358+00:00'
};




app.post('/api/login', function (req, res) {
    let signInPayload = req.body;
    console.log(signInPayload);

    if (signInPayload.username == 'admin' && signInPayload.password == 'admin') {
        let token = generateToken(adminObj);
        let obj = {
            token,
            user: adminObj
        }
        res.send(obj)
    }
    else {
        // Incorrect username/password
        res.status(404).send('Incorrect username/password!');
    }
});

app.get('/api/users', authenticateToken, function (req, res) {
    // check for token
    res.send([adminObj, userObj])
})

app.listen(3000)


const generateToken = (obj) => {
    let secretKey = 'encrypt';
    return jwt.sign(obj, secretKey)
}

function authenticateToken(req, res, next) {
    let secretKey = 'encrypt';
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, secretKey, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}