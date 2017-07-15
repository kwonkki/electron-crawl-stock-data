var rp = require('request-promise');

var cheerio = require('cheerio'); // Basically jQuery for node.js 
const fs = require('fs');
const cron = require('cron');
const iconv  = require('iconv-lite');
var extend = require("jquery-extend");
var urlType = require('url');


function isEmpty(obj) {
    if(isSet(obj)) {
        if (obj.length && obj.length > 0) { 
            return false;
        }

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
    }
    return true;    
};

function isSet(val) {
    if ((val != undefined) && (val != null)){
        return true;
    }
    return false;
};

getDom = function( data ) {
    var dom = cheerio.load(data, { decodeEntities: false, ignoreWhitespace : true });
    return dom;
}

function get_hostname(url) {
    var m = url.match(/^http:\/\/[^/]+/);
    return m ? m[0] : null;
}


function tagConvert(str)
{
    /*
    str = str.replace(/&/g, "&amp;");
    str = str.replace(/>/g, "&gt;");
    str = str.replace(/</g, "&lt;");
    str = str.replace(/"/g, "&quot;");
    str = str.replace(/'/g, "&#039;");
    return str;
    */
    str = str.replace(/\&amp;/g,    "\&");
    str = str.replace(/\&gt;/g,     "\>");
    str = str.replace(/\&lt;/g,     "\<");
    str = str.replace(/\&quot;/g,   "\"");
    str = str.replace(/\&#039;/g,   "\'");
    return str;
}


/**
**  name : _r 

    ///////// parameter #######
    urls : urls array 
    option : scrap option
    sc_data : scrapped data
**
**/
function _r( urls, option, sc_data, request_cb ) {

    if( isEmpty( urls ) ) {
        console.log('urls is null');
        return 'null';
    } 
    

    var opt = {
        method: 'post',
        uri: urls[0],
        
        headers: {
            'content-type': 'text/html; charset=UTF-8' 
        },
        encoding: null,  /* 한글 짤리는것때문에 */
        searchClass : ['body'],
        charset : 'utf-8',
        banWord : [],
        deleteReg : [],
        deleteAlltagWithout : [],
        changeImgUrl : [],
        scrapDomHref : null,
        tagConvert : true
    };

    
    options = extend({}, opt, option);  

    options.uri = urls[0];

    var host = get_hostname(options.uri);


    //console.log(options.uri);

    rp(options)
        .then(function (body) {

            var strContents = new Buffer(body);


            /**
            ** name : charset
            ** type : 
            ** spec : 
            **/            
            var data = iconv.decode(strContents, options.charset).toString();

            var $ = getDom(data);
            

            //console.log('##' + $('body').html());
            
            fs.writeFile('data.txt', $('body').html(), function (err) {
                if (err) 
                    return console.log('error : ' + err);
            });   
            


            //console.log(host);

            //console.log(options.searchClass);
            // STR : looping and search keyword
            //for( var i =0; i < options.searchClass.length; i++ ) {

                var scrapObj = {};  
                var banWord = false;
                /**
                ** name : searchClass 
                ** type : array
                ** spec : search data
                **/
                if( !isEmpty( options.searchClass ) ) {

                    for( var z=0; z < options.searchClass.length; z++ ) {

                        // 내용
                        var scrap = '';
                        var domSplit = null;

                        domSplit = options.searchClass[z].split('>');


                        if( domSplit.length >= 2 ) {

                            var xdom = $(domSplit[0]);

                            for( var x = 1; x < domSplit.length; x++ ){
                                xdom = xdom.find(domSplit[x]);
                            }
                            scrap = xdom.html();
                        } else{
                            scrap = $(options.searchClass[z]).html();
                        }

                        //console.log('scrap : ' +  scrap);

                        if( !isEmpty(scrap )){


                            /**
                            ** name : changeImgUrl 
                            ** type : array
                            ** spec : 
                            **/
                            if( !isEmpty( options.changeImgUrl ) ){
                                for( var j = 0; j < options.changeImgUrl.length;  j++ ) {
                                    
                                    //console.log(options.deleteReg[j]);
                                    var dTag = new RegExp( options.changeImgUrl[j], 'g');

                                    scrap = scrap.replace( dTag, host + '/' );

                                }
                            }                            




                            /**
                            ** name : deleteReg 
                            ** type : array
                            ** spec : delete data using regular expression
                            **/
                            if( !isEmpty( options.deleteReg ) ){
                                for( var j = 0; j < options.deleteReg.length;  j++ ) {
                                    
                                    //console.log(options.deleteReg[j]);

                                    scrap = scrap.replace( options.deleteReg[j], "" );

                                }
                            }

                            /**
                            ** name : deleteAlltagWithout 
                            ** type : array
                            ** spec : <(?!img|br).*?\>
                            **/
                            if( !isEmpty( options.deleteAlltagWithout ) ){

                                var dTagArray = [];


                                for( var j = 0; j < options.deleteAlltagWithout.length;  j++ ) {

                                    dTagArray.push(options.deleteAlltagWithout[j]);
                                }

                                var datag = dTagArray.join('|');
                                var dTag = new RegExp('<(?!'+datag+').*?\>', 'g');
                              
                                scrap = scrap.replace( dTag, "" );                            
                            }


                            /* 안에 태그 빼고 지우기.
                            <(?!img|br).*?\>
                            */

                            //scrap = scrap.replace(/<a href="#" class="btn_original_img">원본이미지 보기<\/a>/, "");


                            //console.log(scrap);
                            /*  
                            1. class 지우기
                            (class=[^ >]+)

                            2.
                            */

                            //fs.writeFile('data.txt', '\r\n#######\r\n' + scrap, function (err) {
                                /*
                            fs.appendFile('data.txt', '\r\n#######\r\n' + scrap, function (err) {
                                if (err) 
                                    return console.log('error : ' + err);
                            });   */



                            /**
                            ** name : banWord 
                            ** type : array
                            ** spec : 금지어 
                            **/
                            if( !isEmpty( options.banWord ) ){

                                var dTagArray = [];
                                

                                for( var j = 0; j < options.banWord.length;  j++ ) {

                                    if( scrap.indexOf( options.banWord[j] ) >=0 ) {
                                        banWord = true;
                                        break;                                        
                                    } 
                                }
                                if( banWord == true) break;
                            }

                            /**
                            ** name : tagConvert 
                            ** type : 
                            ** spec : 태그를 text형식으로 변환한다. 
                            **/
                            if( isSet( options.tagConvert ) && options.tagConvert == true  ){
                                scrap = tagConvert(scrap);                                
                            }

                            // 이미지 절대주소로 바꾸는 작업 -- 추후 작업해야함.
                            /*
                            scrap = scrap.replace('../', 'http://dibira.com/gb/');

                            scrap = scrap.trim();    */

                            scrapObj[z+1] = scrap;
                           
                        } else {
                            console.log('no scrap data : ' +  options.searchClass[z]  );
                        }
                        //console.log( scrap.replace(/\.\.\//gi, mainUrl));
                        //scrapObj[options.searchClass[z]] = scrap;
                        
                    }

                }
            //}
            // 금지어가 포함되어 있지 않을시에,
            if( banWord ==  false ) {
                sc_data[urls[0]] = scrapObj;
            }
            
            // END : looping and search keyword
            
            
            // loop the urls - dont modify
            urls.splice(0,1);
            if( !isEmpty( urls )  ){

                _r(urls, options, sc_data, request_cb);    
            } else{

                // after processing
                /*
                console.log('end');
                console.log(  sc_data )
                console.log(  JSON.stringify(sc_data) )*/
                request_cb(sc_data);
            }
            
        })
        .catch(function (err) {
            console.log(err);
        });
}



exports.r = function (urls, option, request_cb){

    var sc_data = {};   // json을 만들기 위해 object 로 해야 함
    _r(urls, option, sc_data, request_cb );
}

// scrapDomHref 있을 경우 실행
exports.get_urls = function (urls, option, request_cb){

    var sc_data = {};   // json을 만들기 위해 object 로 해야 함
    _r_get_url(urls, option, sc_data, request_cb );
}



/**
**  name : _r_get_url

    ///////// parameter #######
    urls : urls array 
    option : scrap option
    sc_data : scrapped data
**
**/
function _r_get_url( urls, option, sc_data, request_cb ) {

    if( isEmpty( urls ) ) {
        console.log('urls is null');
        return 'null';
    } 
    
    var opt = {
        method: 'post',
        uri: urls[0],
        
        headers: {
            'content-type': 'text/html; charset=UTF-8' 
        },
        encoding: null,  /* 한글 짤리는것때문에 */
        searchClass : ['body'],
        charset : 'utf-8',
        deleteReg : []
    };

    
    options = extend({}, opt, option);  

    options.uri = urls[0];

    var host = get_hostname(options.uri);


    //console.log(options.uri);

    rp(options)
        .then(function (body) {

            var strContents = new Buffer(body);

            var data = iconv.decode(strContents, options.charset).toString();

            var $ = getDom(data);


            // 내용
            var scrap = '';
            var domSplit = null;

            if( !isEmpty( options.scrapDomHref ) ){

                domSplit = options.scrapDomHref.split('>');

                if( domSplit.length >= 2 ) {

                    var xdom = $(domSplit[0]);

                    for( var x = 1; x < domSplit.length; x++ ){
                        xdom = xdom.find( domSplit[x]);
                        
                    }

                } else{
                    xdom = $(options.scrapDomHref )
                }            
            }




            var hrefArray = [];

            xdom.each(function(idx){
                //console.log( '*** : '  + $(this).attr('href') );
                var href = $(this).attr('href');                    

                var herfUrl = urlType.resolve(host, href)

                hrefArray.push(herfUrl)

            })



            // 처리.....................
          
            request_cb(hrefArray);
            
            
        })
        .catch(function (err) {
            console.log(err);
        });
}


