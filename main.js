
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_API_KEY); 


const app = express();

app.use(cors()); // Without this, some frontend calls will be blcoked. Enable cors for all origins, methods, and headers. can be configured to be more restrictive if needed
app.use(express.json());


app.get("/", (req, res) =>{
    //landing page root. othing to see here 
    res.send("Hello Universe!")
});




//GET -> read data, access api endpoint 
// api/transactions/:paramater1/:paramter2/....
//sample transaction ids: TX4042000020160, TX4042000020162

app.get("/api/transactions", async (req, res) =>{
    try{//.hanlding any javascript native intenral server erorrs  (missing supaabse url or apik key, etc)

    
    let {transactionId} = req.query; //query param for "api/transactions?transactionId=....."
    // also use req.param, and app.get("/api/transactions/:transactionId/") if parameter is part of the URL path like api/transactions/TX4042000020162

    let _data; 
    let _err; 

    if (transactionId){
            let {data, error} = await supabase.from("Creds").select().eq("transaction_id", transactionId) //filter by transaction id
            _data = data; 
            _err = error; 
    }else{
            let {data, error} = await supabase.from("Creds").select("*");
            _data = data; 
            _err = error; 
    }
    

    if(_err){  //handles Supabase erorrs instead of internal javascript ones (ie, tbale {Name} doesnt exist) 
        console.log("Error:", _err); 
        return res.status(500).json({
            text: "Error when fetching data",
            error: _err.message, //error message is what we want, everyhting else doenst really help so we can go straight to the .message property
            success: false 
        })
    }else{
        //succesful request 
        res.json({
        text: "Hello World",
        success: true, 
        data: _data || [] //handle case whee data is empty or null 
    }); 

    }


}catch(_err_){
    console.log("Internal server error: ", _err_.message); 
    res.status(500).json({
        text:"Internal Server Error",
        error: _err_.message,
        success: false 
    })
}

})


//POST
//test: 
/*
curl -i -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"transactionId": "TX00000002"}'               

*/

app.post("/api/transactions", async (req, res) =>{
    try{
        let {transactionId} = req.body; //assumes a FirstName and LastName paraters are set 
        if (!transactionId){ //if this paranetrs are missing, send them a 400 code to let them know the input is not accepeted 
             return res.status(400).json({ 
                text:"Missing FirstName or LastName",
                success: false
             })
        }

        const {data, error} = await supabase.from("Creds")
        .insert({
            transaction_id: transactionId
        })
        .select()

        if (error){
            console.log("Supabase error: ", error.message); 
            return res.status(500).json({
                text: "Error on insertion",
                error: error.message
            })
        }

        //the insertion was succesful
        res.status(201).json({
            text:"Posted successfully",
            success: true,
            data: data
        })

    }catch(_err_){
        console.log("Interna server error: ", _err_.message); 
         res.status(500).json({
        text:"Internal Server Error",
        error: _err_.message,
        success: false 
    })
    }
}) 


//PATCH 
//udpate specific field/column. in dataset 
app.patch("/api/transactions/:transactionId", async (req, res) =>{
    try{

        //we must target a row by transaction id since its the primary key of the dataset / table 

        if(!Object.keys(req.body).length){
            return res.status(400).json({
                text: "No body present, no data to udpate with",
                success: false 
            }); 
        }
        
        let {transactionId} = req.params; 

        const {data, error} = await supabase.from("Creds")
        .update(req.body)
        .eq("transaction_id", transactionId)
        .select() //return the specific transaction id after udpating it 


        if (error){
            console.log("Supabase error: ", error.message); 
            return res.status(500).json({
                text:"Error on update",
                error: error.message
            })
        }

        if(data.length == 0){
            console.log("That trassaction Id does not exists"); 
            return res.status(404).json({
                text: "Trasnaction id deos not exist",
                success: false
            })
        }


        res.json({
            text:"Updated successfully",
            success: true,
            data: data
        })

    }catch(_err_){
        console.log("Internal server error: ", _err_.message); 
        res.status(500).json({
                text:"Internal Server Error",
                error: _err_.message
            })
    }
})




//DELETE 
app.delete("/api/transactions/:transactionId", async (req, res) =>{
    try{
        let {transactionId} = req.params; 

        if (!transactionId){ //if this paranetrs are missing, send them a 400 code to let them know the input is not accepeted 
             return res.status(400).json({
                text:"Missing transaction id",
                success: false
             })
        }

        const {data, error} = await supabase.from("Creds")
        .delete()
        .eq("transaction_id", transactionId)
        .select()

        if (error){
            console.log("Supabase error: ", error.message); 
            return res.status(500).json({
                text: "Error on deletion",
                error: error.message
            })
        }

        if(data.length == 0){
            console.log("Trasnaction id does not exists"); 
            return res.status(404).json({
                text:" Transaction id does nto exist",
                success: false 
            })
        }

        // deletion was succesful
        res.json({
            text:"Deleted successfully",
            success: true,
            data: data
        })

    }catch(_err_){
        console.log("Interna server error: ", _err_.message);

         res.status(500).json({
        text:"Internal Server Error",
        error: _err_.message,
        success: false 
    })
    }
})

const PORT = 3000; 

app.listen(PORT, () =>{
    console.log("Server live!")
})