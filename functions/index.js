const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

// Implementamos Express
const app = express();
app.use(cors({origin:true}));

app.get('/',  (req, res) => {
    res.send('Servidor de NodeJS. Para Cloud Function')
});

app.post('/',  (req, res) => {

    const {body} = req;

    const isValidMessage = body.message && body.to && body.subject;

    if(!isValidMessage){
        return res.status(400).send({message: 'Invalid request'});
    }

    const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: '465', // puerto 25: para prueba en local
        secure: true, // false: para prueba en local
        auth: {
            user: "xxxxxx",
            pass: "xxxxxxx"
        }
    });



    const mailOptions = {
        from: `"Luis Carlos 👻" <luis.carlos.charris@gmail.com>`,
        to: body.to,
        subject: body.subject,
        text: body.message
    };


    transporter.sendMail(mailOptions, (err, data) => {
       
        if(err){

            console.log(err)
           return  res.res(500).send({message: "error "+err.message})
        }
        console.log("Mesnsaje enviadooo")
        return res.send({message: "email sent"})
    }); 

});

// Permite configurar el entorno de ejecución

// const runtimeOpts = {
//     timeoutSeconds: 300,
//     memory: '256MB'
// }

module.exports.mailer = functions.https.onRequest(app);