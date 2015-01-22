var path = require('path')
    ,fs = require('fs')
    ,http = require('http')
    ,url = require('url')
    ;
var find = require('find');
var mime = require('mime');
var Router = require('router');
var finalhandler = require('finalhandler');
var urljoin = require('urljoin');

var opts = {
    dir:path.join(__dirname,'assets'),
    ignore:['.git'],
    port:3000,
    ext:'.psd',
    thumbnail_ext:'.png'
};

var router = Router( { mergeParams: true });

var app = function (req, res) {
    router(req, res,finalhandler(req,res));
};

var server = http.createServer(app);

server.listen(opts.port, function () {
    console.log('Server listening at '+this.address().port);
    mkdeepdir(opts.dir);
});

router.use('/json',function(req, res){
    var data = {};
    data.path = req.url;
    data.parentPath = path.dirname(data.path);
    data.assets = [];
    var _realPath = decodeURIComponent(path.join(opts.dir,req.url)) ;
    fs.exists(_realPath, function (exists) {
        if(exists){
            var assets = fs.readdirSync(_realPath);
            assets.forEach(function (value) {
                var _origin = path.join(_realPath,value);
                var lstat = fs.lstatSync(_origin);
                var _ignore = ignoreFolder(_origin);
                var item = {};
                item.name = sliceStr(value,20);
                item.isDir = Number(lstat.isDirectory());
                item.path =  decodeURIComponent( urljoin (data.path,value) );
                item.thumbnail =  item.path.replace(opts.ext,opts.thumbnail_ext);
                item.mtime = lstat.mtime.getTime();

                if(!_ignore&& (item.isDir||path.extname(_origin)==opts.ext) ){
                    data.assets.push(item);
                }

            });
            res.setHeader("Content-Type","application/json");
            res.end(JSON.stringify(data));
        }else{
            e404(res,'Bad request!');
        }
    });


});

router.use('/assets',function(req, res){
    var file = decodeURIComponent(path.join(opts.dir,req.url));
    fs.exists(file, function (exists) {
        if(exists && !fs.lstatSync(file).isDirectory()){
            var binary = fs.readFileSync(file,'binary');
            res.writeHead(200, {
                "Content-Type": mime.lookup(file),
                //"Content-Transfer-Encoding":"binary",
                "Content-Length":binary.length
            });
            res.end(binary,'binary');
        }else{
            e404(res,'File does not exist!');
        }
    });
});

function e404(res,err){
    res.writeHead(404, {"Content-Type": 'text/html'});
    res.end(err);
};

function ignoreFolder(fd){
    var _ignore = false;
    var pathSep = fd.split(path.sep);
    opts.ignore.every(function (val) {
        var ret;
        pathSep.forEach(function (value) {
            if(val == value){
                _ignore = true;
                ret = !true;
            }else{
                ret = !false;
            }
        });
        return ret;
    });
    return _ignore;
}

function sliceStr(str,n){
    if(str.length>n){
        return str.slice(0,n)+'...';
    }else{
        return str;
    }
}
function mkdeepdir (src){
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