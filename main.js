var searchWorker
    , getWorker
    , htmlWorker
    , boolRowSelect = true;
;


/** 
 * fnSearch     Takes the input from search field and sends it to search worker
 * @property {string} sFind input string to search on from the user
 * @property {string} sCol input column the user wants to search on
 * @property {object} oArgs TO to pass to the worker
*/
var fnSearch = function (e) {
    var sFind = document.getElementById("searcher").value.toLowerCase()
        , sCol = document.getElementById('dropdown').value.toLowerCase()
        , oArgs = { "sFind": sFind, "sCol": sCol, "backspace":false }
        ;
    if(e.keyCode == "8" || e.keyCode == "27"){
        oArgs.backspace = true;
    }
    searchWorker.postMessage([{ oArgs }]);
}
/**
 * fnLoadJSON loads up the json data
 * @property {object} args  takes the file name and what columns you don't want to show;
 */
var fnLoadJSON = function () {
    var args = {}
    args.file = "data2.json";
    args.noShowCol = []
    getWorker.postMessage([{ args }]);
}
/** 
 * fnColRowSelect Changes the table to be able to be selected by row or column
*/
var fnColRowSelect = function () {
    boolRowSelect = !boolRowSelect;
    if (boolRowSelect) {
        document.getElementById("highlight").innerText = "Row Selection ON"
    } else {
        document.getElementById("highlight").innerText = "Column Selection ON"
    }
    fnSearch({});
}
/** 
 * fnInit Spins up the workers and their callbacks;
 * @property {object} oAllData All the data to be passed to the search worker from the json getWorker
*/
var fnInit = function () {
    var oAllData
    , elemSearcher = document.getElementById("searcher")
    , elemButton = document.getElementById("highlight");
    elemButton.onclick = fnColRowSelect;
    elemSearcher.onkeyup = fnSearch;
    searchWorker = new Worker('searchWorker.js');
    searchWorker.addEventListener('message', function (e) {
        if (e.data[0].oCopy) {
            fnLoadTable(e.data[0].oCopy)
        }
    }, false);
    getWorker = new Worker('getDataWorker.js');
    getWorker.addEventListener('message', function (e) {
        oAllData = e.data[0];
        fnCreateHeaders(oAllData[0], true)
        fnLoadTable(oAllData);
        searchWorker.postMessage([{ oAllData }]);
    }, false);
    htmlWorker = new Worker('htmlFactoryWorker.js');
    htmlWorker.addEventListener('message', function (e) {
        elemTableBody = document.getElementsByTagName('tbody')[1]
        elemTableBody.innerHTML = e.data[0].html
    }, false);
    fnLoadJSON()

}();
/**
 * fnLoadTable sends data to HTML factory and if we want to be able to highlight by row or column
 * @param {object} oData 
 * @property {object} args  All the data for the table as well as if we want to build row selectable table or column selectable
 */
var fnLoadTable = function (oData) {
    var args = { "oData": oData, "boolRowSelect": boolRowSelect };
    htmlWorker.postMessage([{ args }])
}

/**
 * fnCreateHeaders  Creates the headers for the table
 * @param {object} oData The data so that we can get the keys for the header names
 * @param {boolean} boolUseButton if the user wants sort button or not
 * @property {string} key keys for the data (used for th names)
 * @property {string} sHTMLTable the html for the headers that we insert into the table
 * @property {string} sHTML final html that we will be inserting into main table that could have buttons
 * @property {DOM} elemTable table element
 * @property {DOM} elemDropDown dropdown element for seraching
 * @property {string} sDropHtml html that will populate dropdown with the headers
 * @property {string} sButtonHtml if the user wants to have sorting on each column this is the button html for that sorting
 */
var fnCreateHeaders = function (oData, boolUseButton) {
    var key
        , sHTMLTable = "<tbody>"
        , elemTable = document.getElementById("data")
        , elemDropDown = document.getElementById("dropdown")
        , sDropHtml = `<option value="ALL">ALL</option>`
        , sButtonHtml = ""
        , count = 0
        , sHTML = "<colgroup>"
        ;
        //addeventlistener to theader remove onclick in button html
    for (key in oData) {
        if (boolUseButton) {
            sHTML += "<col id=color"+count+">"
            sButtonHtml = `<button id="sort_`+count + key + `" type="button" onClick="fnSortCol(this.id)"></button>`
            count+=1;
            sHTMLTable += "<th>" + key + sButtonHtml + "</th>"
        } else {
            sHTMLTable += "<th>" + key + "</th>"
        }
        sDropHtml += "<option value=\"" + key + "\">" + key + "</option>";
    }
    elemDropDown.innerHTML = sDropHtml;
    sHTMLTable += "</tbody>"
    sHTML += "</colgroup>"
    sHTML += sHTMLTable
    elemTable.insertAdjacentHTML('afterbegin', sHTML)

}
/**
 * fnSortCol tells the search worker what column the user wants to sort on
 * @param {string} sID the event.id so that we can know what column the user wants to sort on
 * @property {object} oSort TO for the worker that holds the column selected by user
 */
var fnSortCol = function (sID) {
    var nCol = sID.substring(5,6)
    , oSort = {} 
    , elemColGroup = document.getElementById("color"+nCol)
    , elemAllColGroup = document.getElementsByTagName("col")
    , elemChoosenColor = document.getElementById("color_dropdown");
    ;
    sID = sID.substring(6); //5 before i added number
    oSort.col = sID;
    for(var i=0;i<elemAllColGroup.length;i++){
        elemAllColGroup[i].style = "background-color:none";
    }
    elemColGroup.style = "background-color:"+elemChoosenColor.value;
    searchWorker.postMessage([{ oSort }]);
}


