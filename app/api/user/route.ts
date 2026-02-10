const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose"
mongoose.connect(db)

import ServerCatchError from "@/lib/server-catch-error";
import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth";
import { NextResponse as res } from "next/server";
import { authOptions } from "@/lib/auth"

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions)
        if(!session)
            return res.json({message: "Unauthorized"}, {status: 401})

        if(session.user.role !== "admin")
            return res.json({message: "Unauthorized"}, {status: 401})

        const users = await UserModel.find({role: "user"}, {password: 0}).sort({createdAt: -1})
        return res.json(users)
        
    } catch (err) {
        return ServerCatchError(err)
    }
}