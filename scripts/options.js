var fx_options = {
"0": [{container: "si_80000145",plugin: "animate",option: {}},
{container: "audioItem-8",plugin: "audio",option: {}},
{container: "videoItem-10",plugin: "video",option: {}},
{container: "si_80000164",plugin: "animate",option: {}},
{container: "si_80000159",plugin: "animate",option: {}},
{container: "audioItem-9",plugin: "audio",option: {}},
],
};
(function () {
window.FX = window.FX || {};
var paths = [
'core/interface.js',
'core/fx.js',
'core/utils.js',
'plugins/animate.js',
'plugins/audio.js',
'plugins/video.js',
],
baseURL = './scripts/';
for (var i = 0, pi; pi = paths[i++];) {
var extension = pi.split('.').pop();
if(extension === 'css'){
document.write('<link rel="stylesheet" type="text/css" href="' + baseURL + pi  +'"></link>');
}
else{
document.write('<script type="text/javascript" src="' + baseURL + pi + '?timestamp=' +
FX.version +
'"></script>');
}
}
})();
