import { NextRequest, NextResponse as res } from "next/server"
import Stripe from "stripe"
import serverCatchError from "@/lib/server-catch-error"
import OrderModel from "@/models/order.model"
import PaymentModel from "@/models/payment.model"
import CartModel from "@/models/cart.model"
import fs from "fs"
import moment from "moment"
import path from "path"

const root = process.cwd()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CreateOrderInterface {
    user: string
    products: string[]
    discounts: string[]
    prices: string[]
    grossTotal: number
}

interface CreatePaymentInterface {
    user: string
    paymentId: string
    order: string
    vendor?: "stripe"
}

interface DeleteCartsInterface {
    user: string
    products: string[]
}

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
        const { _id } = await OrderModel.create(order)
        return _id.toString()

    } catch (err) {
        return createLog(err, "order")
    }
}

const deleteCarts = async (carts: DeleteCartsInterface) => {
    try {
        const query = carts.products.map((item) => ({user: carts.user, product: item}))
        await CartModel.deleteMany({$or: query})
        return true
        
    } catch (err) {
        return createLog(err, "delete-cart")
    }
}

const createPayment = async (payment: CreatePaymentInterface) => {
    try {
        await PaymentModel.create(payment)
        return true

    } catch (err) {
        return createLog(err, "payment")
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const signature = req.headers.get("stripe-signature")
        if (!signature)
            return res.json({ message: "Invalid signature" }, { status: 400 })

        const body = await req.text()

        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session

            if (!session.metadata?.user || !session.metadata?.orders) {
                return res.json({ message: "Invalid metadata" }, { status: 400 })
            }

            const user = session.metadata.user
            const orders = JSON.parse(session.metadata.orders)
            const paymentId = session.id
            const grossTotal = session.amount_total

            const orderId = await createOrder({ user, ...orders, grossTotal })
            if (!orderId)
                return res.json({ message: "Failed to create order" }, { status: 424 })

            const payment = await createPayment({
                user,
                order: orderId,
                paymentId,
                vendor: "stripe",
            })

            if (!payment)
                return res.json({ message: "Failed to create payment" }, { status: 424 })

            await deleteCarts({user, products: orders.products})

            return res.json({ success: true })
        }

        if (event.type === "payment_intent.payment_failed") {
            console.log("Stripe payment failed")
        }

        return res.json({ success: true })
    } catch (err) {
        console.log(err)
        return serverCatchError(err)
    }
}


// import { NextRequest, NextResponse as res } from "next/server"
// import fs from "fs"
// import moment from "moment"
// import OrderModel from "@/models/order.model"
// import ServerCatchError from "@/lib/server-catch-error"
// import Stripe from "stripe"
// import PaymentModel from "@/models/payment.model"
// interface CreateOrderInterface {
//     user: string
//     products: string[]
//     prices: string[]
//     discounts: string[]
// }
// interface CreatePaymentInterface {
//     user: string
//     order: string
//     paymentId: string
//     vendor?: 'stripe' | 'razorpay'
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// const createOrder = async (order: CreateOrderInterface) => {
//     try {
//         const {_id} = await OrderModel.create(order)
//         return _id
        
//     } catch (err) {
//         if(err instanceof Error) {
//             const dateTime = moment().format('DD-MM-YY:hh:mm:ss:A')
//             fs.writeFileSync(`logs/${dateTime}-ORDER_ERR_LOG.txt`, err.message)
//             return false
//         }
//     }
// }

// const createPayment = async (payment: CreatePaymentInterface) => {
//     try {
//         await PaymentModel.create(payment)
//         return true
        
//     } catch (err) {
//         if(err instanceof Error) {
//             const dateTime = moment().format('DD-MM-YY:hh:mm:ss:A')
//             fs.writeFileSync(`logs/${dateTime}-PAYMENT_ERR_LOG.txt`, err.message)
//             return false
//         }
//     }
// }

// export const POST = async (req: NextRequest) => {
//     try {
//         const signature = req.headers.get('stripe-signature')
//         if(!signature)
//             return res.json({message: "Invalid signature"}, {status: 400})

//         const body = await req.text()

//         let event: Stripe.Event

//         event = stripe.webhooks.constructEvent(
//             body,
//             signature,
//             process.env.STRIPE_WEBHOOK_SECRET!
//         )

//         if(event.type === "checkout.session.completed") {
//             const session = event.data.object as Stripe.Checkout.Session

//             if (!session.metadata?.userId || !session.metadata?.orders) {
//                 return res.json({ message: "Missing metadata" },{ status: 400 })
//             }

//             const user: string = session.metadata?.userId
//             const orders = JSON.parse(session.metadata?.orders || "[]")
//             const paymentId = session.id

//             const orderDoc = await OrderModel.create({ user, ...orders})

//             const orderId = orderDoc._id.toString()

//             const payment = await createPayment({
//                 user,
//                 order: orderId,
//                 paymentId,
//                 vendor: "stripe",
//             })

//             if(!payment)
//                 return res.json({message: 'Failed to create payment'}, {status: 424})

//             return res.json({success: true})
//         }
//         return res.json({success: true})

//     } catch (err) {
//         return ServerCatchError(err)
//     }
// }