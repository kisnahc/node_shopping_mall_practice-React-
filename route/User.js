const express = require("express")
const bcrypt = require("bcrypt")

const router = express.Router()

const userModel = require("../models/User")


//회원가입 API

router.post('/register', (req, res) => {

    //email 중보체크 => 패스워드 암호화 => DB save
    userModel
        .findOne({email: req.body.useremail})
        .then(user => {
            //중복된다면
            if(user) {
                return res.json({
                    msg: "중복된 이메일 입니다."
                })
            }
            //중복되지 않는다면 패스워드를 암호화한다.
            else {
                bcrypt.hash(req.body.userpassword, 10, (err, hash) => {
                    if(err) {
                        return res.json({
                            msg: err.message
                        })
                    }
                    //암호화를 한 후 데이터베이스에 저장.
                    else {
                        const newUser = new userModel({
                            name: req.body.username,
                            lastname: req.body.userlastname,
                            email: req.body.useremail,
                            password: hash,
                        })
                        newUser
                            .save()
                            .then(user => {
                                res.json({
                                    msg: "saved user",
                                    userInfo: user
                                })
                            })
                            .catch(err => {
                                res.json({
                                    msg: err.message
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            res.json({
                msg: err.message
            })
        })
})

//로그인 API

router.post('/Login', (req, res) => {
    //이메일 유무체크 => password 매칭 => 유저정보 리턴
    userModel
        .findOne({email: req.body.useremail})
        .then(user => {
            //가입된 이메일이 아니라면
            if(!user) {
                return res.json({
                    msg: "가입된 이메일이 아닙니다."
                })
            }
            //가입된 이메일이 맞으면
            else {
                res.json({
                    msg: "succssful Login",
                    userInfo: user
                })
            }
        })
        .catch(err => {
            res.json({
                msg: err.message
            })
        })
})

module.exports = router