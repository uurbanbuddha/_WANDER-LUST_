const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required().min(0),
        country: Joi.string().required(),
        location: Joi.string().required(),

    }).required()
});


/* joi object ke andar object (listing) aur listing ke liye bata ke ye ek object hogi aur required hogi; fir listing object ke anda cheeze define kari */

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
});