var fx_options = {
    "0": [{ container: "multiStateItem-17", plugin: "slideShow", option: {} },
        { container: "multiStateItem-18", plugin: "slideShow", option: {} },
        { container: "buttonItem-15", plugin: "button", option: {} },
        { container: "buttonItem-16", plugin: "button", option: {} },
        { container: "multiStateItem-19", plugin: "slideShow", option: {} },
    ],
};
(function() {
    window.FX = window.FX || {};
    var paths = [
            'observe.polyfill.min.js',
            'core/interface.js',
            'core/fx.js',
            'core/utils.js',
            'plugins/slideShow.js',
            'plugins/button.js',
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