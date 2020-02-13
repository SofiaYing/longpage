var fx_options = {
    // "0": [{container: "videoItem-4",plugin: "video",option: {}},
    // ],
};
(function() {
    window.FX = window.FX || {};
    var paths = [
            'core/interface.js',
            'core/fx.js',
            'core/utils.js',
            'plugins/video.js',
        ],
        baseURL = './scripts/';
    for (var i = 0, pi; pi = paths[i++];) {
        var extension = pi.split('.').pop();
        if (extension === 'css') {
            document.write('<link rel="stylesheet" type="text/css" href="' + baseURL + pi + '"></link>');
        } else {
            document.write('<script type="text/javascript" src="' + baseURL + pi + '?timestamp=' +
                FX.version +
                '"></script>');
        }
    }
})();