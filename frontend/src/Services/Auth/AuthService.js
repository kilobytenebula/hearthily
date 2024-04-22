import axios from "axios";
import BaseService from "../Base/BaseService";

class AuthService{
    constructor(){
        BaseService.getBaseURL()
        this.REGISTER_URL = "auth/register"
        this.LOGIN_URL = "auth/login"
        this.Forgot_URL = "auth/forgotPassword"
        this.RESET_PASS = "auth/reset-password";
    }
    authRegister(input) {
        let data = {
            email : input.email,
            password:input.password,
            role:'user',
            name:input.username
        }
        return axios.post(this.REGISTER_URL,data)
    }
    authLogin(input) {
        let data = {
            email : input.email,
            password: input.password
        }
        return axios.post(this.LOGIN_URL,data)
    }
    forgotPassword(input) {
        let data = {
            nic : input.nic,
            newPassword: input.password,
        }
        return axios.post(this.Forgot_URL,data)
    }
    resetPassword(email) {
        console.log(email)
        let data =  email 
        return axios.post(this.RESET_PASS,data)
    }
    addNewPassword(token,password) {
        let data = { password }
        return axios.post(`auth/verify-reset-password/${token}`,data)
    }
}
export default AuthService = new AuthService();