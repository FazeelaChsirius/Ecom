import { NextRequest, NextResponse as res } from "next/server"
import fs from "fs"
import crypto from "crypto"

export const POST = async (req: NextRequest) => {
    const signature = req.headers.get('x-stripe-signature')
    if(signature)
        return res.json({message: "Invalid signature"}, {status: 400})

    const body = await req.json()

    const mySignature = crypto.createHmac('sh256', process.env.STRIPE_WEBHOOK_SECRET!)
    .update(JSON.stringify(body))
    .digest('hex')

    if(signature !== mySignature)
        return res.json({message: "Invalid signature"}, {status: 400})

    if(body.event === "payment.authorized" && process.env.NODE_ENV === "development") {
        console.log("Payment success")
    }

    if(body.event === "payment.captured") {
        console.log("paymeent success")
    }

    if(body.event === "payment.failed") {
        console.log("paymeent failed")
    }

    fs.writeFileSync("test.json", JSON.stringify(body, null, 2))
    console.log("Request received")
    return res.json({message: 'success'})
}