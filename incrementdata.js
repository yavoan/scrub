var mock = require('./mock.json');
const fs = require('fs');

var doIt = function(){
    //mock = JSON.parse(mock);
    for(i=0;i<mock.length;i++){
        mock[i].id = mock[i].id+2000;
        console.log(mock[i])
    }
    fs.writeFile('newJSON.json', JSON.stringify(mock), (err) => {  

    });
}()