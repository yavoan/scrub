self.addEventListener('message', function (e) {
    var cache = e.data[0].args
        , oData = cache.oData
        , boolRowSelect = cache.boolRowSelect
        , sHTML = ""
        ;
        if(boolRowSelect){
            sHTML = fnConstructRowSelection(oData)
        }else{
            sHTML = fnConstructColSelection(oData)
        }
    self.postMessage([{ "html": sHTML }]);
}, false);

/**
 * fnConstructRowSelection this method constructs the html so that the user can select row by row.
 * @param {Object} oData All the data to be put into the table
 */
var fnConstructRowSelection = function (oData) {
    var key
        , nDataLength = oData.length
        , sHTML = ""
        , i=0
        ;
    for (; i < nDataLength; i += 1) {
        if (!oData[i]) {
            continue;
        }
        sHTML += '<tr>'
        for (key in oData[i]) {
            sHTML += '<td>' + oData[i][key] + '</td>'
        }
        sHTML += '</tr>'
    }
    return sHTML;
}
/**
 * fnConstructColSelection this method constructs the html so that the user can select col by col.
 * @param {Object} oData  All the data to be put into the table
 */
var fnConstructColSelection = function (oData) {
    var key
        , nDataLength = oData.length
        , sHTML = ""
        , goodRow = 0
        , i=0
        ;
        sHTML += '<tr>'
        for(i=0;i<nDataLength;i+=1){
            if(oData[i]){
                goodRow=i;
                break;
            }
        }
        for (key in oData[goodRow]) {
            sHTML += "<td>"
            sHTML += "<table>"
            for (i = 0; i < nDataLength; i += 1) {
                if (!oData[i]) {
                    continue;
                }
                sHTML += '<tr><td>' + oData[i][key] + '</td></tr>'
            }
            sHTML += "</table>"
            sHTML += "</td>"
    
        }
        sHTML += '</tr>'
        return sHTML;
}