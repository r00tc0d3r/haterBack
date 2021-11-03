require('dotenv').config();
const jwt = require('jsonwebtoken');

//Sign
var token = jwt.sign({ name: process.env.TOKEN_USER, password: process.env.TOKEN_PASS  }, process.env.TOKEN_SECRET);
//var token = jwt.sign({ user: '', password: '' }, "secret", { algorithm: 'RS256' });
console.log(token);


//Decoding
jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
        console.log("Error");
    }
    else {
        console.log("DECODED")
        console.log(decoded);
    }
});

//Decoding
//var decoded = jwt.verify(token, 'MrRobot');
//console.log(decoded);