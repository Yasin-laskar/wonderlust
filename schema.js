
const Joi = require('joi');
const review = require('./models/review');
const { model } = require('mongoose');


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
      
    }).required()
});








// Corrected Joi schema


module.exports.reviewSchema = Joi.object({
    Review: Joi.object({
        range: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});


 // Exporting the schema for use

