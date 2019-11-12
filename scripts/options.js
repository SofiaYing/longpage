var fx_options = {
"0": [{container: "si_8000029A",plugin: "animate",option: {}},
{container: "si_800000FF",plugin: "animate",option: {}},
{container: "si_800002CA",plugin: "animate",option: {}},
{container: "si_800002A7",plugin: "animate",option: {}},
{container: "si_800002FB",plugin: "animate",option: {}},
{container: "si_8000011D",plugin: "animate",option: {}},
{container: "audioItem-67",plugin: "audio",option: {}},
{container: "si_80000304",plugin: "animate",option: {}},
{container: "si_800002E3",plugin: "animate",option: {}},
{container: "si_800001D2",plugin: "animate",option: {}},
{container: "audioItem-68",plugin: "audio",option: {}},
{container: "si_80000271",plugin: "animate",option: {}},
{container: "si_8000027D",plugin: "animate",option: {}},
{container: "si_800002CD",plugin: "animate",option: {}},
{container: "audioItem-69",plugin: "audio",option: {}},
{container: "si_80000318",plugin: "animate",option: {}},
{container: "si_800002C5",plugin: "animate",option: {}},
{container: "si_80000186",plugin: "popupContent",option: {}},
{container: "si_80000154",plugin: "animate",option: {}},
{container: "buttonItem-70",plugin: "button",option: {}},
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
'plugins/popupContent.js',
'plugins/button.js',
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
