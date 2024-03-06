const cheerio = require('cheerio');
const url = require('./constants').jumsUrl

async function verifyFromJums(username,passowrd){
    const uname = username
    const pass = passowrd

    //use form data html post req

    const data = {
        'uname':uname,
        'pass':pass
    }

    var formBody = [];

    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");

    //set url x-www-form-urlencoded
    console.log(data)
    const otherParam = {
        method:"POST",
        body:formBody,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "Accept":"text/html",
            "Accept-Encoding":"gzip, deflate",
            "Accept-Language":"en-US,en;q=0.9",
            "Connection":"keep-alive",
        }
    }

    // fetch(url,otherParam)
    // .then(data=>data.text())
    // .then(res=>{
    //     if(res.includes("Invalid Username/Password")){
    //         return false
    //     }
    //     else{
    //         //all td element tags
    //         const root = parse(res)
    //         const td = root.querySelectorAll('td')
    //         console.log(td)
    //         // console.log(res)
    //         return true
    //     }
    // })

    //rewrite with async await

    const response = await fetch(url,otherParam)
    const res = await response.text()
    if(res.includes("Invalid Username/Password")){
        return false
    }
    else{
        const $ = cheerio.load(res)
        let name = $('td:contains("Name:")').next().text().trim();
        let department = $('td:contains("Department:")').next().text().trim();
        let course = $('td:contains("Course:")').next().text().trim();

        //remove all white spaces except normal space
        name = name.replace(/\s\s+/g, ' ');

        //extract last two words and make for each such word make the first character only uppercase and others lowercase
        name = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        //filter last two words
        name = name.split(' ').slice(-2).join(' ');

        return {name,program:department,degree_name:course}
    }
}

module.exports = verifyFromJums;