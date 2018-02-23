self.addEventListener('message', function (e) {
    var xobj = new XMLHttpRequest()
        , file = e.data[0].args.file
        , aNoShowCol = e.data[0].args.noShowCol
        , data
        , i = 0
        , j = 0
        , nDataLength
        , nColumnLen = aNoShowCol.length
        , sColRemove
        ;
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            data = xobj.responseText;
            data = JSON.parse(data);
            nDataLength = data.length;
            if (nColumnLen > 0) {
                for (; i < nDataLength; i += 1) {
                    for (j = 0; j < nColumnLen; j += 1) {
                        sColRemove = aNoShowCol[j];
                        delete data[i][sColRemove];
                    }
                }
            }
            self.postMessage([data]);
            close();
        }
    }
    xobj.send(null);
}, false);