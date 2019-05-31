var fx_options = {
    "0": [
        { container: "audioItem-8", plugin: "audio", option: {} },
        // { container: "si_800001AE", plugin: "animate", option: {} },
        // { container: "si_800001AB", plugin: "animate", option: {} },
        // { container: "si_800001B2", plugin: "animate", option: {} },
        { container: "audioItem-9", plugin: "audio", option: {} },
    ],
};
(function() {
    window.FX = window.FX || {};
    var paths = [
            'observe.polyfill.min.js',
            'core/interface.js',
            'core/fx.js',
            'core/utils.js',
            'plugins/audio.js',
            'plugins/animation.js',
            // 'plugins/animate.js',
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