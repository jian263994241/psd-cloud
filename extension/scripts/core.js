/**
 * jianl@ctrip.com
 * jianl
 */
var url = require('url');
var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var urljoin = require('urljoin');
var CSLibrary = new CSInterface();

var Core = function(){
    this.fs = fs;
    this.path = path;
    this.url = url;
    this.http = http;
    this.urljoin = urljoin;
    this.cs = CSLibrary;
} ;

var tmpFolderPath = null;
var tmpImgFolderPath = null;

/**
 *
 * @param str //url
 * @returns {object}
 */
Core.prototype.queryParse = function(str){
    var urlobj = url.parse(str);
    return querystring.parse(urlobj.query);
};
/**
 * error handle
 * @param name{string}
 * @param messsage{string}
 */
Core.prototype.error = function(name,message){
    function MyError (name,message){
        this.name = name||'Error';
        this.message = message ;
    }
    MyError.prototype = new Error();
    try{
        throw new MyError(name,message);
    }catch (e){
        console.error(e.name +":"+ e.message+"\n" +e.stack);
    }
};
/**
 * get extension psd folder
 * @returns {string}
 */
Core.prototype.getTmpFolderPath = function() {
    if (tmpFolderPath == null) {
        tmpFolderPath = CSLibrary.getSystemPath(SystemPath.EXTENSION) + '/tmp/';
    };
    tmpFolderPath = decodeURIComponent(tmpFolderPath);
    if(!fs.existsSync(tmpFolderPath)){
        this.mkdeepdir(tmpFolderPath);
    }
    return tmpFolderPath;
};

/**
 * long path
 * @param src{string}
 */
Core.prototype.mkdeepdir = function(src){
    var target = decodeURIComponent(src);
    var dirCreate = function(src) {
        var parentDir = path.dirname(src);
        if (!fs.existsSync(parentDir)) {
            return dirCreate(path.dirname(src));;
        }
        !fs.existsSync(src)&&fs.mkdirSync(src);
    }
    return dirCreate(target);
};
/**
 * download psd
 * @param originURL{string}
 * @param toLocal{string}
 */
Core.prototype.downloadFile = function (originURL,toLocal,progress,sucess,error) {
    var _this = this;
    var originURL = decodeURIComponent(originURL);
    var toLocal = decodeURIComponent(toLocal);
    var urlobj = url.parse(originURL);
    var options = {
        host: urlobj.hostname,
        port: urlobj.port,
        path: urlobj.path
    };
    http.get(options, function(res) {

        var chunks = [],
            chunksLength = 0,
            contentLength =  res.headers["content-length"];
        if(res.statusCode == '404'){
            _this.error(null,'res.statusCode:404');
            return false;
        };
        res.on('data', function (chunk) {
            chunksLength += chunk.length
            chunks.push(chunk);
            progress&&progress((chunksLength/contentLength).toFixed(2));
        });
        res.on('error',function(err){
            _this.error(null,err);
        });
        res.on('end', function () {
            _this.mkdeepdir(path.dirname(toLocal));
            fs.writeFile(toLocal,Buffer.concat(chunks),function (err) {
                if(err){
                    _this.error(null,err);
                }else{
                    if(path.extname(toLocal) =='.psd'){
                        fs.chmodSync(toLocal,'444');
                    };
                    sucess&&setTimeout(sucess,800);
                };
            });
        });
    }).on('error',function(e){
        error&&error(e);
        _this.error("Got error: " + e.message);
    });
};
/**
 * psd path
 * @param filePath
 */
Core.prototype.psdCopy = function(filePath){
    filePath = filePath.replace(/\\/g,'\\\\');
    CSLibrary.evalScript('addElementAll("' + filePath + '")' ,function(a){
        console.log(a);
    });
};
/**
 * psd path
 * @param filePath
 */
Core.prototype.psdOpen = function(filePath){
    filePath = filePath.replace(/\\/g,'\\\\');
    CSLibrary.evalScript('openDoc("' + filePath + '")' ,function(a){
        console.log(a);
    });
};

module.exports = new Core();
