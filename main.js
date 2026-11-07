require('dotenv').config();

const express = require('express');
const sup = require('@supabase/supabase-js');
const supabase = sup.createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_API_KEY); 


const app = express();

app.get("/", async (req, res) =>{
    let {data, err} = await supabase.from("Creds").select("*"); 
    let response;

    if(err){ 
        response = err; 
    }else{
        response = data; 
    }

    res.send("Hello Universe \n" + JSON.stringify(response)); 

    res.end();
})

app.listen(3000, () =>{
    console.log("Server live!")
})