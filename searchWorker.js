"use strict";
importScripts('fast-clone/index.js');
var oAllData
    , sort = { "sort": false, "col": "", "ascending": false, "lastSearch": "", "lastCol": "" }
    , oLatestDataSet = {};
self.addEventListener('message', function (e) {
    var oCopy
        , oCache = {};
    if (e.data[0].oAllData) {
        oAllData = e.data[0].oAllData;
        self.postMessage("Success");
    } else if (e.data[0].oSort) {
        sort.sort = true;
        sort.col = e.data[0].oSort.col;
        oCopy = clone(oAllData)
        sort.ascending = !sort.ascending;
        oCopy = fnSearch(sort.lastSearch, sort.lastCol)
        self.postMessage([{ oCopy }])
    }
    else {
        oCache = e.data[0].oArgs
        oCopy = fnSearch(oCache.sFind, oCache.sCol, oCache.backspace)
        self.postMessage([{ oCopy }]);
    }
}, false);
/**
 * fnSearch searches data and removes rows that don't have the search string
 * @param {string} sFind the search string from the user input
 * @param {string} sCol  the column the user wants to search on
 * @param {boolean} backspace  if the client backspaced I can't use the previous search results for the last letter and I have to search on all data.
 * @property {boolean} bKeep determines if we are keeping the row in the table or not;
 * @property {object} oRow one row of the data
 * @property {integer} i count for looping through data
 * @property {object} oCopy copy of the main data because we don't want to alter it
 * @property {integer} nLen length of oCopy
 * @property {string} key key so that we can iterate through row object
 * 
 */
var fnSearch = function (sFind, sCol, backspace) {
    var bKeep = false
        , oRow
        , i = 0
        , oCopy = []
        , nLen
        , key
        ;
    sort.lastSearch = sFind;
    sort.lastCol = sCol;

    if (!backspace && sFind.length > 1) {
        oCopy = clone(oLatestDataSet);
    } else {
        oCopy = clone(oAllData);
    }

    nLen = oCopy.length;
    if (sFind != "") {
        for (; i < nLen; i += 1) {
            oRow = oCopy[i];
            if (sCol == "all") {
                for (key in oRow) {
                    if (oRow[key].toString().toLowerCase().indexOf(sFind) > -1) {
                        bKeep = true;
                        break;
                    }
                }
            } else {
                if (oRow && oRow[sCol].toString().toLowerCase().indexOf(sFind) > -1) {
                    bKeep = true;
                }
            }
            if (!bKeep) {
                delete oCopy[i]
            }
            bKeep = false;
        }
    }
    if (sort.sort) {
        oCopy = fnMasterSorter(oCopy);
    }
    if (sFind.length > 0) {
        oLatestDataSet = clone(oCopy);
    }
    return oCopy;
}
/**
 * fnMasterSorter sorts the data in ascending or descending order for one column
 * @param {object} oCopy Copy of the data because we don't want to alter the original
 */
var fnMasterSorter = function (oCopy) {
    var aOCopy = [oCopy]
        , sortMe = aOCopy.slice(0)
        ;
    sortMe[0].sort(fnSortCol);
    return sortMe[0];
}
/**
 * fnSortCol sort callback function to sort data in ascending or descending order
 * @param {object} a one row
 * @param {object} b one row
 * @property {string/integer} x depending on row element could be number or string used for sorting comparision
 * @property {string/integer} y depending on row element could be number or string used for sorting comparision
 */
var fnSortCol = function (a, b) {
    var x
        , y;
    if (Number.isInteger(a[sort.col])) {
        x = a[sort.col]
        y = b[sort.col]
    } else {
        x = a[sort.col].toLowerCase();
        y = b[sort.col].toLowerCase();
    }
    if (sort.ascending)
        return x < y ? -1 : x > y ? 1 : 0;
    else
        return x < y ? 1 : x > y ? -1 : 0;

}
