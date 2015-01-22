var core = require('./scripts/core.js');
var cc_url = 'http://localhost:3000';
var cc_url_json = core.urljoin(cc_url,'json');
var cc_url_assets = core.urljoin(cc_url,'assets');
var tmpFolderPath = null;
var tmpImgFolderPath = null;




$(document).ready(function () {
    themeManager.init();
    $.get(cc_url_json).done(function () {
        init();
    }).fail(function () {
        init(true);
    });

});

function init(offline){
    viewUpdate(core.urljoin(cc_url_json,'/'),offline);
};

function viewUpdate(origin,offline){
    var compiled = _.template($('#filesListTpl').html());
    var content = $('#content');
    var bindEvent = function ($wrap) {
        $wrap.find('.thb').on('click', function () {
            var _origin = $(this).data('origin');
            var _localFile = decodeURIComponent( core.path.join(core.getTmpFolderPath(),_origin) );
            var isDir = Number($(this).data('isdir'));
            var exists = core.fs.existsSync(_localFile);
            //dir
            if(isDir){
                viewUpdate(core.urljoin(cc_url_json,_origin),offline);
                return false;
            };
            //files
            if(!exists){
                var _mask = $(this).find('.mask');
                var _progressBar = $(this).find('.progress');
                var _progressBarMeter = _progressBar.find('.progress-bar');
                var _download_icon =  $(this).find('.glyphicon-cloud-download');
                _download_icon.hide();
                _progressBar.show();
                core.downloadFile(core.urljoin(cc_url_assets,_origin),_localFile, function (n) {
                    _progressBarMeter.css('width', n*100+'%');
                }, function () {
                    _progressBar.hide();
                    _mask.hide();
                } ,function (error) {
                    _progressBar.hide();
                    _download_icon.show();
                    alert('Download failed!');
                });
            }else{

            }
        });
        $wrap.find('[data-toggle="tooltip"]').tooltip();

        $wrap.find('img').each(function(k,img){
            var src = $(img).data('src');
            var localFile = core.path.join(core.getTmpImgFolderPath(),src.replace(cc_url_assets,''));
            if(offline){
                $(img).attr('src',localFile);
            }else{
                $(img).attr('src',src);
                core.downloadFile(src,localFile);
            }

        });
    };

    if(offline){
        var _path = encodeURIComponent(origin) ;
        if(localStorage[_path]){
            jsonDone(JSON.parse(localStorage[_path]));
        }else{
            core.error(null,'localStorage["'+_path+'"]');
        }
    }else{
        $.getJSON(origin,jsonDone);
    };

    function jsonDone(data){
        data.cc_url = cc_url_assets;
        data.assets.forEach(function(value){
            if(!value.isDir){
                var realPath = decodeURIComponent( core.path.join(core.getTmpFolderPath(),value.path) );
                value.exists = core.fs.existsSync(realPath);
            }
        });
        data.assets = _.sortBy(data.assets,function(o){ return o.exists?0:1;});

        localStorage[encodeURIComponent(origin)] = JSON.stringify(data);

        var $ele = $(compiled(data));
        $ele.hide();
        content.html($ele);
        $ele.fadeIn(800);
        bindEvent(content);
    };

};


