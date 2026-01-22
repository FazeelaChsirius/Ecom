const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import ServerCatchError from "@/lib/server-catch-error"
mongoose.connect(db)

import { NextRequest, NextResponse as res } from "next/server"
import mongoose from "mongoose"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_KEY_SECRET!)

export const POST = async (req: NextRequest) => {
    try {
        const userSession = await getServerSession(authOptions)
        if(!userSession)
            return res.json({message: "Unauthorized"}, {status: 401})

        if(userSession.user.role !== "user")
            return res.json({message: "Unauthorized"}, {status: 401})

        const body = await req.json()
        const { amount, user, orders } = body
        console.log('stripe-body', body)

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: "red shirt"
                    },
                    unit_amount: (body.amount *100)
                },
                quantity: 1
            }],
            metadata: {
                shopName: "Ecom Shops",
                description: "Bulk Product",
                currency: "inr",
                userId: user.id,
                name: user.name,
                email: user.email,
                amount: amount * 100,
                orders: JSON.stringify(orders)
            },
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        })

        return res.json({url: session.url})
        
    } catch (err) {
        return ServerCatchError(err)
    }
}