const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyparser.urlencoded({extended : true}));
app.use(express.static("public"));

app.get("/" , function(req , res){
    res.sendFile(__dirname + "/index.html");
    
})

app.post("/" , function(req , res){
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address:email,
                status: "subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname,
                }
            }
        ]
    }

    const jsondata = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/400480db1c"
    const options = {
        method : "POST",
        auth: "astronaut1:1b7b033d94b38c6880930e57211a267a-us21"
    }

    const request = https.request(url , options , function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data" , function(data){
            console.log(response.statusCode);
        });

    });

    request.write(jsondata);
    request.end();

});

app.post("/failure" , function(req ,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000 , function(){
    console.log("server is running at post 3000");
});
