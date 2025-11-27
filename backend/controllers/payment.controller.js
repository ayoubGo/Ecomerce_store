import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";


export const createCheckout = async (req, res) => {
    try {
        const {products, couponCode} = req.body;

        if(!Array.isArray(products) || products.length === 0 ){
            return req.statusCode(400).json({message : "Invalid or empty products array" });
        }

        let totalAmount = 0;

        const lineItems = products.map(product => { // lineItems is basically a product but stripe expects this name 
            const amount = Math.round(product.price * 100); // stripe is expection the price in cents
            totalAmount += amount * product.quantity;


            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name : product.name,
                        images : [product.image],

                    },
                    unit_amount:amount
                }
            }
        })


        let coupon = null;
        if(couponCode){
            coupon = await Coupon.findOne({code: couponCode, userId : req._id, isActive:true});
            if(coupon){
                totalAmount -= Math.round(totalAmount * coupon.discountPercetage / 100);
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items : lineItems,
            mode :"payment",
            success_url:`${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon ?
                [
                    {
                        coupon : await createStripeCoupon(coupon.discountPercetage)
                    }
                ] 
                : [],
                metadata:{
                    userId:req.user._id.toString(),
                    coupon: couponCode || "",
                    products: JSON.stringify(products.map((p) => ({
                        id: p._id,
                        quantity: p.quantity,
                        price: p.price,
                    })))
                }
            
        });

        if(totalAmount > 20000){ // 200$ *100 => 20000 cent
            await createNewCoupon(req.user._id)
        }
        res.status(200).json({id:session.id, totalAmount: totalAmount/100})



    } catch (error) {
        console.log("Error in createChekout controller");
        res.status(500).json({message : "Server error",  error: error.message});
    }
}

export const checkoutSuccess = async (req, res) => {
    try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid"){

            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate({
                    code : session.metadata.couponCode, userId: session.metadata.userId
                },{
                    isActive :false
                })
            }

            // create a new Order
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map(product => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price
                })),
                totalAmount: session.amount_total /100, // so we can convert from cent to dollars
                stripeSessionId: sessionId
            })

            await Order.save();

            res.status(200).json({
                success: true,
                message: "Payment successful, order created , and coupon deactivated if used",
                orderId : newOrder._id
            })
        }
    } catch (error) {
        console.log("Error processing successful checkout ", error.message);
        res.status(500).json({message : "Error processing successful checkout",  error: error.message});
    }
}

async function createStripeCoupon(discountPercentage){
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once"
    });

    return coupon.id;
};

async function createNewCoupon(userId){
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercetage: 10,
        expiredDate : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId
    })

    await newCoupon.save();

    return newCoupon;
}
