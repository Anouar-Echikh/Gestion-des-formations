var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const emailController = {};

emailController.sendEmail = (req, res, next) => {
  

  const { from,name,text} = req.body
   
//----------------- send email ----------------------------

var transporter = nodemailer.createTransport(smtpTransport({
service: "gmail",
host: "smtp.gmail.com",
auth: {
  user: "elearning.academy.tn@gmail.com",
  pass: "evsucuefcuapfezu" //google app password  
}
}));

console.log("from",from)
console.log("name",name)    
console.log("text",text)    


    var modifMailptions = {
  from: from,
  to: "elearning.academy.tn@gmail.com",
  subject:`E-Learning Academy App-web : ${name} a envoyé un email `,
  html: `<br> <span><h4>[E-Learning Academy - webApp] </h4> <b>Email envoyé par:</b><br> Nom et prénom: <b> ${name} </b><br>Son Email est : <b> ${from} </b><br>Text : <br><div style=" border: 1px solid black; border-radius: 5px;padding:5px 7px 5px 7px;font-weight:bolder;font-size:14px">${text}<br><br></span>`
};
transporter.sendMail(modifMailptions, function (error, info) {
  if (error) {
    console.log("error email:", error);
    res.send({success:false, errorMessage: error }) 
  } else {  
    console.log("Email sent with success from webApp : " + info.response);
    res.send({success:true, SuccessResult: info.response })     
  }
});


//--------end email  ------------------


    
}

module.exports = emailController;
