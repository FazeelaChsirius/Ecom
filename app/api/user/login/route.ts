import mongoose from "mongoose"
mongoose.connect(process.env.DB!)

import bcrypt from "bcrypt"
import ServerCatchError from "@/lib/server-catch-error"
import { NextRequest, NextResponse as res } from "next/server"
import UserModel from "@/models/user.model"

export const POST = async (req: NextRequest) => {
    try {
        const {email, password} = await req.json()
        const user = await UserModel.findOne({email})

        if(!user)
            return res.json({message: "User not found"}, {status: 404})

        const isLogin = await bcrypt.compare(password, user.password)

        if(!isLogin)
            return res.json({message: "Incorrect Credentials"}, {status: 401})

        return res.json({message: "Login success"})
        
    } catch (err) {
        return ServerCatchError(err)
    } 
}