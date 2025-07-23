import { Schema, model, models } from "mongoose"

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true

    },
    discount: {
        type: Number,
        trim: true,
        default: 0
    },
    image: {
        type: String,
        requied: true
    },
    slug: {
        type: String
    }
}, {timestamps: true})

productSchema.pre('save', function(next){
    this.slug = this.title.toLowerCase().split(" ").join("-")
    next()
})

const ProductModel = models.Product || model("Product", productSchema)
export default ProductModel