import nodemailer from 'nodemailer'
import isEmpty from 'lodash/isEmpty'

interface SendMailParams {
  mailHostOptions?: any
  deliveryOptions?: {
    from: string // sender address
    to: string // list of receivers
    subject: string // Subject line
    text?: string // plain text body
    html?: string // html body
  }
}

// async..await is not allowed in global scope, must use a wrapper
export async function sendMail({ deliveryOptions }: SendMailParams) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount()

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  })

  const defaultDeliveryOptions = {
    from: '"Website Manager" <manger@website.com>', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello there' // plain text body
  }
  if (!isEmpty(deliveryOptions)) {
    deliveryOptions = { ...defaultDeliveryOptions, ...deliveryOptions }
  }

  // send mail with defined transport object
  const info = await transporter.sendMail(deliveryOptions)

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
