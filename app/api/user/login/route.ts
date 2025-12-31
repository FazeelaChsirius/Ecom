import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import bcrypt from "bcrypt"
import ServerCatchError from "@/lib/server-catch-error"
import { NextRequest, NextResponse as res } from "next/server"
import UserModel from "@/models/user.model"

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json()
        const email = body.email
        const password = body.password
        const provider = body.provider

        const user = await UserModel.findOne({email})
        console.log('login-user', user)

        const payload = {
            id: user._id,
            name: user.fullname,
            email: user.email,
            createdAt: user.createdAt,
            gender: 'male',
            age: '25'
        }

        if(!user)
            return res.json({message: "User not found"}, {status: 404})
 
        if(provider === "google")
            return res.json(payload)

        const isLogin = await bcrypt.compare(password, user.password)

        if(!isLogin)
            return res.json({message: "Incorrect Credentials"}, {status: 401})

        return res.json(payload)
        
    } catch (err) {
        return ServerCatchError(err)
    } 
}