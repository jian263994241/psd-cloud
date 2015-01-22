var url = require('url');
var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var urljoin = require('urljoin');
var CSLibrary = new CSInterface();

var Core = function(){} ;

Core.prototype.fs = fs;
Core.prototype.path = path;
Core.prototype.url = url;
Core.prototype.http = http;
Core.prototype.urljoin = urljoin;
Core.prototype.cs = CSLibrary;

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
 * get extension folder
 * @returns {string}
 */
Core.prototype.getTmpFolderPath = function() {
    if (tmpFolderPath == null) {
        tmpFolderPath = CSLibrary.getSystemPath(SystemPath.EXTENSION) + '/tmp/';
    }0
    return decodeURIComponent(tmpFolderPath);
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
            dirCreate(path.dirname(src));
            return false;
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
            progress((chunksLength/contentLength).toFixed(2));
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
                    setTimeout(sucess,800);
                };
            });
        });
    }).on('error',function(e){
        _this.error("Got error: " + e.message);
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
