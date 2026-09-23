const express=require("express");
const nodemailer=require("nodemailer");
const fs=require("fs");
const path=require("path");
require("dotenv").config();
const app=express();
const LOG_DIR=path.join(__dirname,"_mail_logs");
if(!fs.existsSync(LOG_DIR))fs.mkdirSync(LOG_DIR,{recursive:true});
const TO_EMAIL=process.env.TO_EMAIL||"pragadeeshwaran199@gmail.com";

app.use(express.static(__dirname));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

function clean(v,max=2000){return String(v||"").trim().slice(0,max)}
async function sendMail({subject,text,replyTo}){
 const {SMTP_HOST,SMTP_PORT,SMTP_USER,SMTP_PASS,SMTP_SECURE}=process.env;
 if(!SMTP_HOST||!SMTP_USER||!SMTP_PASS)throw new Error("SMTP is not configured");
 const transporter=nodemailer.createTransport({
   host:SMTP_HOST,port:Number(SMTP_PORT||465),
   secure:String(SMTP_SECURE).toLowerCase()==="true"||String(SMTP_PORT||465)==="465",
   auth:{user:SMTP_USER,pass:SMTP_PASS}
 });
 return transporter.sendMail({
   from:`Velora Website <${SMTP_USER}>`,
   to:TO_EMAIL,subject,text,
   replyTo:replyTo||undefined
 });
}

app.post("/send_email",async(req,res)=>{
 try{
   if(clean(req.body.website))return res.redirect(303,"/thank-you.html?status=ok");
   const name=clean(req.body.fullName,120),business=clean(req.body.businessName,160);
   const email=clean(req.body.email,160),phone=clean(req.body.phone,60);
   const service=clean(req.body.service,100),message=clean(req.body.message,4000);
   if(!name||!email||!message)return res.redirect(303,"/thank-you.html?status=error&msg=Please%20complete%20the%20required%20fields");
   const subject=`New Velora enquiry — ${business||name}`;
   const text=[
    "NEW VELORA WEBSITE ENQUIRY","",
    `Name: ${name}`,`Business / project: ${business||"—"}`,
    `Email: ${email}`,`Phone: ${phone||"—"}`,`Service: ${service||"—"}`,"",
    "Message:",message,"",
    `Submitted: ${new Date().toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})}`
   ].join("\n");
   await sendMail({subject,text,replyTo:email});
   return res.redirect(303,"/thank-you.html?status=ok");
 }catch(err){
   console.error("Email error:",err.message);
   const stamp=Date.now();
   fs.writeFileSync(path.join(LOG_DIR,`request_${stamp}.txt`),JSON.stringify({body:req.body,error:err.message,at:new Date().toISOString()},null,2));
   return res.redirect(303,"/thank-you.html?status=queued");
 }
});
const port=Number(process.env.PORT||8000);
app.listen(port,()=>console.log(`Velora running at http://127.0.0.1:${port}`));
