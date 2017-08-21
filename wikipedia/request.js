const url = "de.wikipedia.org/w/api";

const squery = "?action=query&format=json&list=search&srsearch=Einstein";

function isUndefined(object){ return typeof object == 'undefined';  }


function getParams(query , params){
    for(var element in query){
        if(!(element ==="Q" || element === "page" || element === "filter")) {
            return 400;
        }
    }
    if (isUndefined(query.Q)) return 400;
    params.q = encodeURIComponent(query.Q);
    if (isUndefined(query.page)) {
        params.page.limit  = isUndefined(query.page.limit)  ? Number(params.page.limit)  : Number(query.page.limit);
        params.page.offset = isUndefined(query.page.offset) ? Number(params.page.offset) : Number(query.page.offset);
        if (!isUndefined(query.page.limit)  && query.page.limit == '')  return 400;
        if (!isUndefined(query.page.offset) && query.page.offset == '') return 400;
    }
    if ( isNaN(pageParams.limit)  || pageParams.limit <= 0) return 400;
    if ( isNaN(pageParams.offset) || pageParams.offset < 0) return 400;

    if (isUndefined(query.filter)){
        for( filter in query.filter	){
            params.filter.count++ ;
            params.filter.data.push(
                {
                    name:filterParam,
                    value:query.filter[filter]
                }
            );
        }
    }
}


module.exports.makeRequest =  function (query, accept , errCallback ,sendCallback) {
    var request = require('request-promise');
    var status = 200;
    if (!accept) {
        errCallback("Error",404);
        return 0;
    }
    var params = {
        q : "",
        page : {
            offset : 0 ,
            limit : 10
        },
        filter : {
            count : 0,
            data : []
        }
    };
    request(url+squery)
        .then(function(requestResult){
            return JSON.parse(requestResult);})
        .then(function(JSONresponse){
            status = getParams(query,params);
            if (status!=200){
                errCallback("Error",status);
                return 0;
            }
            sendCallback(JSON.stringify(JSONresponse));
        });
};
