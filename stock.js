// http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_3474.tw_20140801&json=1&delay=0
var http = require('http'),
    dateFormat = require('dateformat');

STOCK_PREFIX 	= "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_"
STOCK_NUM 	= "2455";
STOCK_INFIX 	= ".tw_";
STOCK_DATE 	= dateFormat(new Date(), "yyyymmdd");
STOCK_SUFFIX 	= "&json=1&delay=0"

STOCK_THRESHOLD = 0;
QUERY_TIMEOUT	= 5000;

strUrl = STOCK_PREFIX + STOCK_NUM + STOCK_INFIX + STOCK_DATE + STOCK_SUFFIX;

console.log('URL we ready to Get : \n' + strUrl);

setInterval(function() {
	http.get(strUrl, function(res) {
		res.on("data", function(chunk) {
			var timeStamp = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
			
			var string = JSON.parse(chunk);
			console.log('[' + timeStamp + ']' + 
						' Stock Code\t:' + string.msgArray[0].c +'  |  ' +
						'Stock Price\t:' + string.msgArray[0].z);
			
			if (STOCK_THRESHOLD > 0 && STOCK_THRESHOLD >= string.msgArray[0].z) {
				console.log('Threshold Arrived!!!');
			}
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}, QUERY_TIMEOUT);

// process.stdout.clearLine();  // clear current text
// process.stdout.cursorTo(0);  // move cursor to beginning of line
