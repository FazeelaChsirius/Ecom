const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import mongoose from "mongoose"
mongoose.connect(db)

import { NextRequest, NextResponse as res } from "next/server"
import ServerCatchError from "@/lib/server-catch-error"
import ProductModel from "@/models/product.model"
import SlugInterface from "@/interface/slug.interface"

export const GET = async (req: NextRequest, context: SlugInterface) => {
    try {
        const {slug} = context.params
        const product = await ProductModel.findOne({slug})

        if(!product)
            return res.json({message: 'Product not found with slug'}, {status: 404})

        return res.json(product)
        
    } catch (err) {
        return ServerCatchError(err)
    }
}

export const PUT = async (req: NextRequest, context: SlugInterface) => {
    try {
        const {slug: id} = context.params
        const body = await req.json()
        const product = await ProductModel.findByIdAndUpdate(id, body, {new: true})

        if(!product)
            return res.json({message: 'Product not found with slug'}, {status: 404})

        return res.json(product)
        
    } catch (err) {
        return ServerCatchError(err)
    }
}

export const DELETE = async (req: NextRequest, context: SlugInterface) => {
    try {
        const {slug: id} = await context.params
        const product = await ProductModel.findByIdAndDelete(id)

        if(!product)
            return res.json({message: 'Product not found with slug'}, {status: 404})

        return res.json(product)
        
    } catch (err) {
        return ServerCatchError(err)
    }
}