var fs = require('fs');
var cron = require('cron');
var email = require('./mail.js');
var webshot = require('webshot');
var _u = require('./r-utils.js');

var cronJob = cron.job("*/1 * * * * *", function(){

	sc();
	cronJob.stop();
});


/*
var req_obj = {
            // 여기서 charset 설정해야 한다.
            charset : 'euc-kr',
            urls : 'http://www.etorrent.co.kr/bbs/board.php?bo_table=star',
            // href태그를 가져온 후에 looping을 돈다
            scrapDomHref : '',
            // 해당 dom을 search
            searchClass : ['.mw_basic_list_subject > a:nth-child(3)'],   

            banWord : '',   
            // 가져온 데이터에서 없앨 데이터 reg
            deleteReg : '',
            // 가져온 데이터에서 해당 태그만 두고 다 없앤다.
            deleteAlltagWithout : 'br',
            // 
            changeImgUrl : '',

            maxLimit : '5'
        };*/


var req_obj = {
            // 여기서 charset 설정해야 한다.
            charset : 'euc-kr',
            urls : 'http://finance.naver.com/item/main.nhn?code=005930',
            // href태그를 가져온 후에 looping을 돈다
            scrapDomHref : '',
            // 해당 dom을 search
            searchClass : ['div.today > p.no_today > .no_up > .blind'],   

            banWord : '',   
            // 가져온 데이터에서 없앨 데이터 reg
            deleteReg : '',
            // 가져온 데이터에서 해당 태그만 두고 다 없앤다.
            deleteAlltagWithout : 'br',
            // 
            changeImgUrl : '',

            maxLimit : '5'
        };

_u.r([req_obj.urls], req_obj, 
    function(data){
    //console.log(data)

    var digit = data[req_obj.urls]['1'];
    digit = digit.replace(/,/g, '' );
    
    var stockPrice = Number(digit);
    console.log(stockPrice)

    if( stockPrice  >= 500000 ) {

    	shot(req_obj.urls);
    	console.log('####take photo#####')
    } else {
    	console.log('#### no photo#####')
    }

	//console.log(jsonObj)

}); 


var options = {
	  screenSize: {
	    width: 350
	  , height: 768
	  }
	, shotSize: {
	    width: 'screen'
	  , height: 'screen'
	  }
	, userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
	    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g',
	renderDelay : 3000
};

function shot ( url ){
	webshot( url, 
		'screenshot.png', options, function(err) {
	  	// screenshot now saved to flickr.jpeg
	  	email.email();
	});	
};
