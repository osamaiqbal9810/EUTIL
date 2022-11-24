var nodemailer = require('nodemailer');
var config = require('../config/environment');

//Parameters
//mailOptions {
//              to: email_addrss
//              subject: string
//              html:    <p> Your html
//              }
//callback:(function) (err, info)

const mailConfig = config.email;
var transporter = nodemailer.createTransport({
	service: mailConfig.provider,
	host: mailConfig.host,
  	port: mailConfig.port,
	secure: false,
	auth: {
		user: mailConfig.user,
		pass: mailConfig.pass,
	},
	tls: {
		rejectUnauthorized: false
	}
});

const mailOption = {
	from: mailConfig.user, // sender address
	to: 'to@email.com', // list of receivers
	subject: 'Subject of your email', // Subject line
	html: '<p>Your html here</p>'// plain text body
};

class EmailService {
	constructor(logger) {
		this.logger = logger;
	}

	sendEmail(mailOptions, fnCallback){

	if (!mailOptions.to) {
		fnCallback(new Error(mailConfig.errors.no_recipient), null);
		return;
	}
	mailOption.to = mailOptions.to;
	mailOption.subject = mailOptions.subject || '';
	mailOption.html = mailOptions.html;
	if(process.env.NODE_ENV==="development")
	{
		if(!mailOption.to.endsWith("@powersoft19.com"))
		{
			console.log("In development enviornment email will only be sent to email@powersoft19.com addresses.");
			console.log("Skipping email transmission to:"+mailOption.to);
			fnCallback(null,{});
			return;
		}
	}
	// verify connection configurations
	transporter.verify(function(error, success) {
		if (error) {
			console.log(error);
		} else {
			//console.log("Server is ready to take our messages");
			transporter.sendMail(mailOptions, function (err, info) {
                 if(err)
                 	this.logger.error(err.message());
                 //console.log(err);
                 else
                 	this.logger.success("Email sent successfully to " + mailOptions.to);
                 //console.log(info);
				fnCallback(err, info);
			});
		}
	});
	}
}
module.exports = EmailService;