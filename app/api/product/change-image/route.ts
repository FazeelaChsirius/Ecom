const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose"
mongoose.connect(db)

import {v4 as uuid} from "uuid"
import { NextRequest, NextResponse as res } from "next/server"
import ServerCatchError from "@/lib/server-catch-error"
import ProductModel from "@/models/product.model"
import fs from "fs"
import path from "path"
import { message } from "antd"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

export const PUT = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions)
        if(!session)
            return res.json({message: "Unauthorized"}, {status: 401})

        if(session.user.role !== "admin")
            return res.json({message: "Unauthorized"}, {status: 401})

        const body = await req.formData()
        const id = body.get("id")
        const file = body.get('image') as File | null
        
        if(!file)
            return res.json({message: "Product image not sent"}, {status: 400})

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const root = process.cwd()
        const folder = path.join(root, "public", "products")
        const fileName = `${uuid()}.png`
        const filePath = path.join(folder, fileName)

        fs.writeFileSync(filePath, buffer)

        const payload = {
            image: `/products/${fileName}`,
        }

        const product = await ProductModel.updateOne({_id: id}, {$set: payload})
        return res.json({message: "Image changed"})
        
    } catch (err) {
        return ServerCatchError(err)
    }
}
