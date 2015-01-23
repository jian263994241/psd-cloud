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
 * get extension img folder
 * @returns {string}
 */
Core.prototype.getTmpImgFolderPath = function() {
    if (tmpImgFolderPath == null) {
        tmpImgFolderPath = CSLibrary.getSystemPath(SystemPath.EXTENSION) + '/images/tmp/';
    }
    tmpImgFolderPath = decodeURIComponent(tmpImgFolderPath);
    if(!fs.existsSync(tmpImgFolderPath)){
        this.mkdeepdir(tmpImgFolderPath);
    }
    return tmpImgFolderPath;
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
            core.fs.writeFile(toLocal,Buffer.concat(chunks), function (err) {
                if(err){
                    _this.error(null,err);
                }else{
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
    CSLibrary.evalScript('psdCopy("' + filePath + '")' ,function(a){
        console.log(a);
    });
};

/**
 *
 * @param data{object}
 */
//Core.prototype.shotoshopScripts = function(data){
//    var _script = core.fs.readFileSync(core.path.join(core.getJsFolderPath(),'photoshop.jsx'),'utf8');
//    var _compiled  = _.template(_script);
//    core.cs.evalScript(_compiled(data), function (result) {
//        console.log('----->>> evalScript callback result : ' + result + ' <<<-----');
//    });
//};


module.exports = new Core();
