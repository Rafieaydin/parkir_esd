import User from '#models/user'
import { forgotPasswordValidator, loginValidator, registerValidator, resendCodeEmailValidator, resendCodePhoneValidator, resetPasswordValidator, verifyPhoneValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { messages } from '@vinejs/vine/defaults'



export default class AuthController {

  public async login({ request, response }: HttpContext) {
    const { email,  password } = request.all()

      await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)
      if (!user) {
        return response.status(401).json({ message: {
          status: 'error',
          message: 'Invalid credentials'
        }})
      }
      const token = await User.accessTokens.create(user)
      return response.status(200).json({ message: {
        status: 'success',
        data: {
          user :user,
          token:token
        }
      }})
  }

  public async verifyPhone({request, response}:HttpContext){
    const {phone, code} = request.all()
    await request.validateUsing(verifyPhoneValidator)
    const user = await User.findBy('phone', phone)
    if (!user){
      return response.status(401).json({
        messages :{
          status:'error',
          message: 'invalid credential'
        }
      })
    }
    if (user.code_verification == code){
      user.code_verification = null
      await user.save()

      const token = await User.accessTokens.create(user)
      return response.status(200).json({ message: {
        status: 'success',
        data: {
          user :user,
          token:token
        }
      }})
    }
    return response.status(401).json({
      messages :{
        status:'error',
        message: 'invalid credential'
      }
    })
  }

  public async register({request, response}:HttpContext){
    const {fullname,email, password, repeat_password,role, phone,
      dateOfBirth, gender} = request.all()
    await request.validateUsing(registerValidator)
    const user = User.findBy('email', email)
    console.log(user, email)
    if(await user){
      return response.status(401).json({
        messages :{
          status:'error',
          message: 'invalid credential'
        }
      })
    }
    if(password == repeat_password){
      var users = await User.create({ fullName:fullname, email:email, password:password, role:role, phone:phone, dateOfBirth:dateOfBirth, gender:gender})
      var token = await User.accessTokens.create(users)
      return response.status(200).json({ message: {
        status: 'success',
        data: {
          user :user,
          token:token
        }
      }})
    }
    // else
    return response.status(401).json({
      messages :{
        status:'error',
        message: 'invalid credential'
      }
    })
  }

  public async forgotPassword({request, response}:HttpContext){
    const {email} = request.all()
    await request.validateUsing(forgotPasswordValidator)
    const user = await User.findBy('email', email)
    if (!user){
      return response.status(401).json({
        messages :{
          status:'error',
          message: 'invalid credential'
        }
      })
    }

    const email_code_verifications =(Math.floor(Math.random()*90000) + 10000).toString()
    user.email_code_verification = email_code_verifications
    await user.save()

    mail.send((message) => {
      message
        .from('slotify@example.org') // from email
        .to(user.email)
        .subject('Email Verification Code ')
        .htmlView('eemail_verification', { email_code_verifications })
    })
    // send email
    return response.status(200).json({ message: {
      status: 'success',
      messages: 'Email code verification has been sent',
      data: {
        user :user,
        email_code_verification:email_code_verifications,
      }}})
  }

  public async resetPassword({request, response}:HttpContext){
    const {email, password,repeat_password, code} = request.all()
    await request.validateUsing(resetPasswordValidator)
    const user = await User.findBy('email', email)
    if (!user){
      return response.status(401).json({
        messages :{
          status:'error',
          message: 'invalid credential'
        }
      })
    }
    if(password == repeat_password){
      if (user.email_code_verification == code){
        user.password = password
        user.email_code_verification = null
        await user.save()
        return response.status(200).json({ message: {
          status: 'success',
          data: user
        }})
      }else{
        return response.status(401).json({
          messages :{
            status:'error',
            message: 'invalid email code verification'
          }
        })
      }
    }else{
      return response.status(401).json({
        messages :{
          status:'error',
          message: 'invalid credential'
        }
      })
    }
  }

  public async resendCodeEmail({request, response}:HttpContext){
    const {email} = request.all()
    await request.validateUsing(resendCodeEmailValidator)
    const user = await User.findBy('email', email)
    if (!user){
      return response.status(401).json({
        messages :{
          status:'error',
          message: 'invalid credential'
        }
      })
    }

    const email_code_verifications = (Math.floor(Math.random()*90000) + 10000).toString();
    user.email_code_verification = email_code_verifications
    await user.save()

    mail.send((message) => {
      message
        .from('slotify@example.org') // from email
        .to(user.email)
        .subject('Email Verification Code ')
        .htmlView('eemail_verification', { email_code_verifications })
    })

    // send email
    return response.status(200).json({ message: {
      status: 'success',
      messages: 'Email code verification has been sent',
      data: {
        user :user,
        email_code_verification:email_code_verifications,
      }}})
  }

  public async resendCodePhone({request, response}:HttpContext){
    const {phone} = request.all()
    await request.validateUsing(resendCodePhoneValidator)
    const user = await User.findBy('phone', phone)
    if (!user){
      return response.status(401).json({
        messages :{
          status:'error',
          message: 'invalid credential'
        }
      })
    }

    const phone_code_verifications = (Math.floor(Math.random()*90000) + 10000).toString()
    user.code_verification = phone_code_verifications
    await user.save()
    // send email
    return response.status(200).json({ message: {
      status: 'success',
      messages: 'Phone code verification has been sent',
      data: {
        user :user,
        phone_code_verification:phone_code_verifications,
      }}})
  }

  public async logout({ response, auth }: HttpContext) {
    const user = await User.accessTokens.delete(auth.getUserOrFail(),(await auth.authenticate()).currentAccessToken.identifier)
    return response.status(200).json({ message: {
      status: 'success',
      message: user
    }})
  }

  public async token({ response,auth } : HttpContext) {
    return response.status(200).json({
      status:'succes',
      data : await User.accessTokens.all(auth.user!)
    })
  }

}
