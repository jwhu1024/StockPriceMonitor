// http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1234.tw&json=1&delay=0&_=1527140228574
var http 		= require('http'),
    dateFormat	= require('dateformat');

STOCK_PREFIX	= "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_";
STOCK_CODE		= "1234";
STOCK_INFIX 	= ".tw&json=1&delay=0&_=";
STOCK_TIMESTAMP	= new Date().getTime();

STOCK_THRESHOLD = 10;
QUERY_TIMEOUT	= 1000;

strUrl = STOCK_PREFIX + STOCK_CODE + STOCK_INFIX + STOCK_TIMESTAMP;

console.log('URL we ready to Get : \n' + strUrl);
console.log('--------------------------------------\n');

var old_price = '';

setInterval(function() {
    var retry_int = setInterval(function() {
	http.get(strUrl, function(res) {
    		var data = '';
    		res.on("data", function(chunk) {
    			data += chunk;
    		});
    		res.on("end", function() {
    			var timeStamp = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
    			var string = JSON.parse(data);
    			
                if (string.msgArray === undefined) {
                    console.log("undefined msgArray");
                    clearInterval(retry_int);
                } else {

    			    if (old_price !== string.msgArray[0].z) {
    			    	process.stdout.clearLine();  // clear current text
    			    	process.stdout.cursorTo(0);  // move cursor to beginning of line
    			    	process.stdout.write('[' + timeStamp + ']' + 
    			    						 ' Code:' + string.msgArray[0].c + '  |  ' +
    			    						 'Price:' + string.msgArray[0].z);
    			    						 
    			    	// Save the older price
    			    	old_price = string.msgArray[0].z;
    			    } else {
    			    	process.stdout.write('.');
    			    }
     
     			    if (STOCK_THRESHOLD > 0 &&  string.msgArray[0].z >= STOCK_THRESHOLD) {
    				    console.log('Threshold Arrived!!!');
    			    }
                }
    		});
    	}).on('error', function(e) {
		    console.log("Got error: " + e.message);
	    });
    }, QUERY_TIMEOUT);
}, QUERY_TIMEOUT);

// process.stdout.clearLine();  // clear current text
// process.stdout.cursorTo(0);  // move cursor to beginning of line
