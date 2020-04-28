let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LibrosSchema = Schema(
    {
        _id: {type: Schema.ObjectId, auto:true},
        title : String,
        isbn : String ,
        pageCount : Number ,
        publishedDate : Date,
        thumbnailUrl : String,
        shortDescription : String,
        longDescription : String ,
        status : String ,
        authors : Array,
        categories : Array
    }
)


module.exports = mongoose.model('Book', LibrosSchema)