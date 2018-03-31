const pify = require('pify');
const request = require('request');

// var options = {
//     url : 'http://www.pseudocoder.rocks/api/face',
//     method : 'POST',
//     headers : headers,
//     json : true,
//     body : formData
// };

const options = {
    url : 'http://grad-project-app.herokuapp.com/user/register',
    method : 'POST',
    headers : {
        'Content-Type' : 'application/json'
    },
    json : true,
    body : {
        email : 'kimilsik@gmail.com',

    }
};


pify(request)(options)
    .then((res, body) => {
        console.log('request succeed.');

        if (res.statusCode === 200) {

            console.log("res : ");
            console.log(res);
            console.log("body : ");
            console.log(body);
        } else if (res.statusCode === 400) {
            console.log('some error occured.');
            console.log(res);
            console.log(body);
        }
    })
    .catch(e => console.log(e));


// request(options, function(err, res, body) {
//     console.log('in request');
//     if (err) console.log(err);
//     else {
//         if (res.statusCode === 200) {
//             console.log('successfully trasmitted.');
//             console.log("res : ", JSON.stringify(res, undefined ,2));
//             console.log("body : ", JSON.stringify(body, undefined ,2));
//
//             results.push(body.message);
//             //res.send(results);
//         } else {
//             console.log('something wrong.', res.statusCode);
//         }
//     }
// });