import mongoose, { model, models, Schema } from "mongoose";
import UserModel from "./user.model";
import OrderModel from "./order.model";

const paymentSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: UserModel,
        required: true
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    vendor: {
        type: String,
        default: 'stripe',
        enum: ['stripe', 'razorpay']
    },
    paymentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    fee: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

const PaymentModel = models.Payment || model("Payment", paymentSchema)
export default PaymentModel