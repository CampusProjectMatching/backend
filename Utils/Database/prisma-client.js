const { PrismaClient } = require('@prisma/client');

//write a singleton to return the client
var prismaClientInstance = null;
function prismaClient(){
    // write a singleton to return the client
    if(prismaClientInstance == null){
        //try to connect if failed, waqit 2 sec and connect again
        while(true){
            try{
                prismaClientInstance = new PrismaClient();
                break;
            }catch(e){
                console.error(e);
                console.log("Retrying to connect to database in 2 seconds");
                setTimeout(()=>{},2000);
            }
        }
    }

    return prismaClientInstance;
}

module.exports =  prismaClient;