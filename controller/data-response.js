
module.exports=(httpCode,status,message,data)=>{
    return {
        httpCode,
       response:{ status,
        message,
        data
       }

    }

}