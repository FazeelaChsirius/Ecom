import { NextRequest, NextResponse as res } from "next/server"
import Stripe from "stripe"
import OrderModel from "@/models/order.model"
import PaymentModel from "@/models/payment.model"
import CartModel from "@/models/cart.model"
import fs from "fs"
import moment from "moment"
import path from "path"
import ServerCatchError from "@/lib/server-catch-error"

const root = process.cwd()
interface CreateOrderInterface {
    userId: string
    products: string[]
    discounts: string[]
    prices: string[]
    grossTotal: number
}

interface CreatePaymentInterface {
    user: string
    paymentId: string
    orderId: string
    vendor?: "stripe"
    currency: string | null
    amount: number | null
    // status: string | null
    // tax: string
    // fee: number
    // payment_method_types: string | null
}

// interface DeleteCartsInterface {
//     user: string
//     products: string[]
// }

const createLog = (err: unknown, service: string) => {
    if(err instanceof Error) {
        const dateTime = moment().format('DD-MM-YYYY_hh-mm-ss_A');
        const filePath = path.join(root, 'logs', `order-error-${dateTime}.txt`)
        fs.writeFileSync(filePath, err.message)
        return false
    }
}

const createOrder = async (order: CreateOrderInterface) => {
    try {
        const { orderId } = await OrderModel.create(order)
        return orderId

    } catch (err) {
        return createLog(err, "order")
    }
}

// const deleteCarts = async (carts: DeleteCartsInterface) => {
//     try {
//         const query = carts.products.map((item) => ({user: carts.user, product: item}))
//         await CartModel.deleteMany({$or: query})
//         return true
        
//     } catch (err) {
//         return createLog(err, "delete-cart")
//     }
// }

// const createPayment = async (payment: CreatePaymentInterface) => {
//     try {
//         await PaymentModel.create(payment)
//         return true

//     } catch (err) {
//         return createLog(err, "payment")
//     }
// }

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.text()
        const parsedBody = JSON.parse(body)

        const paymentData = JSON.stringify(parsedBody, null, 2)
        fs.writeFileSync("payment.json", paymentData)

        const data = parsedBody.data.object.status
        console.log('webhook-status', data)

        const amount = parsedBody.data.object.amount
        console.log('webhook-amount', amount)

        const currency = parsedBody.data.object.currency
        console.log('webhook-currency', currency)

        const metadata = parsedBody.data.object.metadata
        console.log('metadata', metadata)

        const orders = parsedBody.data.object.metadata.orders
        console.log('orders', orders)

        const userId = parsedBody.data.object.userId
        console.log('userId', userId)
        
        // const metadata = req.body.data.object.metadata
        // const products = JSON.parse(metadata.products)

        const orderId = await createOrder({userId, ...orders})

        if(!orderId)
            return res.json({message: 'Failed to create order'}, {status: 424})

        return res.json({message: "Request received from stripe"})

    } catch (err) {
        return ServerCatchError(err)
    }
}

// export const POST = async (req: NextRequest) => {
//     try {
//         const paymentData = JSON.stringify(req.body, null, 2)
//         fs.writeFileSync("payment.json", paymentData)
//         res.json({message: "Request received from stripe"})

//         // const signature = req.headers.get("stripe-signature")
//         // if (!signature)
//         //     return res.json({ message: "Invalid signature" }, { status: 400 })


//         // if (event.type === "checkout.session.completed") {
//         //     const session = event.data.object as Stripe.Checkout.Session

//         //     if (!session.metadata?.user || !session.metadata?.orders) {
//         //         return res.json({ message: "Invalid metadata" }, { status: 400 })
//         //     }
//         //     // const {currency, status, payment_method_types} = event.data.object
//         //     const user = session.metadata.user
//         //     const orders = JSON.parse(session.metadata.orders)
//         //     const paymentId = session.id
//         //     const grossTotal = session.amount_total

//         //     const orderId = await createOrder({ user, ...orders, grossTotal })
//         //     if (!orderId)
//         //         return res.json({ message: "Failed to create order" }, { status: 424 })

//         //     const payment = await createPayment({
//         //         user,
//         //         orderId,
//         //         paymentId,
//         //         amount: grossTotal,
//         //         currency: session.currency
//         //     })

//         //     if (!payment)
//         //         return res.json({ message: "Failed to create payment" }, { status: 424 })

//         //     await deleteCarts({user, products: orders.products})

//         //     return res.json({ success: true })
//         // }

//         // return res.json({ success: true })

//     } catch (err) {
//         console.log(err)
//         return serverCatchError(err)
//     }
// }
