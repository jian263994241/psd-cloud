
var cc_url = 'http://localhost:3000';
var tmpFolderPath = null;

var core = require('./scripts/core.js');

$(document).ready(function () {
    init();
});

function init(){
    themeManager.init();
    viewUpdate(core.urljoin(cc_url,'json'));
};

function viewUpdate(origin){
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
                viewUpdate(core.urljoin(cc_url,'json',_origin));
                return false;
            };
            //files
            if(!exists){
                var _mask = $(this).find('.mask');
                var _progressBar = $(this).find('.progress');
                var _progressBarMeter = _progressBar.find('.progress-bar');
                $(this).find('.glyphicon-cloud-download').hide();
                _progressBar.show();
                core.downloadFile(core.urljoin(cc_url,'assets',_origin),_localFile, function (n) {
                    _progressBarMeter.css('width', n*100+'%');
                }, function () {
                    _progressBar.hide();
                    _mask.hide();
                } ,function (error) {
                    core.error(null,error);
                });
            }else{

            }
        });
        $wrap.find('[data-toggle="tooltip"]').tooltip();
    };
    $.getJSON(origin,function(data){
        data.cc_url = core.urljoin(cc_url,'assets');
        data.assets.forEach(function(value){
            if(!value.isDir){
                var realPath = decodeURIComponent( core.path.join(core.getTmpFolderPath(),value.path) );
                value.exists = core.fs.existsSync(realPath);
            }
        });
        data.assets = _.sortBy(data.assets,function(o){ return o.exists?0:1;});
        var $ele = $(compiled(data));
        $ele.hide();
        content.html($ele);
        $ele.fadeIn(800);
        bindEvent(content);
    });
};
