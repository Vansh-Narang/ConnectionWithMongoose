
mongoose.connect('mongodb://127.0.0.1:27017/amazon')// (/vansh added to add the database)
const con = mongoose.connection
con.on('open', function () {
    console.log("connected ");
})
