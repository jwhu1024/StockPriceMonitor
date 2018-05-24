// http://mis.twse.com.tw/stock/fibest.jsp?stock=2317
// http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2317.tw&json=1&delay=0&_=1527146997659

var request = require('request'),
	dateFormat	= require('dateformat');
	
var STOCK_THRESHOLD = 10,
	QUERY_TIMEOUT	= 1000,
	URL				= "http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_",
	STOCK_ID 		= "2317",
	URL_INF			= ".tw&json=1&delay=0&_=";

function getCookies (callback) {
    request("http://mis.twse.com.tw/stock/fibest.jsp?stock=" + STOCK_ID, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return callback(null, response.headers['set-cookie']);
        } else {
            return callback(error);
        }
    })
}

function getStockInfo (cookie, callback) {
	var options = {
		url: URL + STOCK_ID + URL_INF + new Date().getTime(),
		headers: {'Cookie': cookie}
	};	

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(JSON.parse(body));
		}
	});
}

function printInOneLine (string) {
	var timeStamp = dateFormat(new Date(), "yyyy-mm-dd h:MM:ss")
	process.stdout.clearLine();  // clear current text
	process.stdout.cursorTo(0);  // move cursor to beginning of line
	process.stdout.write('[' + timeStamp + '] ' + string);
}

// entry
getCookies(function (err, cookie){
	if(!err) {
		// console.log('Get the cookie --> ' + cookie);
		
		setInterval(function () {
			getStockInfo(cookie, function (res) {
				var fullData = res;
				
				if ( typeof fullData.msgArray !== 'undefined' && fullData.msgArray ) {
					printInOneLine (' Code:' + fullData.msgArray[0].c + '  |  ' +
									'Price:' + fullData.msgArray[0].z)
				} else {
					printInOneLine ("waiting for retry in " + QUERY_TIMEOUT/1000 + " seconds...")
				}
			});
		}, QUERY_TIMEOUT);
	} else {
		console.log("get cookie error");
	}
})
