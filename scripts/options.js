var fx_options = {
"0": [{container: "si_8000010F",plugin: "animate",option: {}},
{container: "si_800000F1",plugin: "animate",option: {}},
{container: "si_800001C3",plugin: "animate",option: {}},
{container: "si_80000118",plugin: "animate",option: {}},
{container: "si_800001C6",plugin: "animate",option: {}},
{container: "si_80000140",plugin: "animate",option: {}},
{container: "si_800001CC",plugin: "animate",option: {}},
{container: "si_8000011C",plugin: "animate",option: {}},
{container: "si_80000183",plugin: "animate",option: {}},
{container: "si_80000135",plugin: "animate",option: {}},
{container: "si_80000139",plugin: "animate",option: {}},
{container: "si_800001CF",plugin: "animate",option: {}},
{container: "si_80000186",plugin: "animate",option: {}},
{container: "si_800001D2",plugin: "animate",option: {}},
{container: "si_8000014E",plugin: "animate",option: {}},
{container: "si_80000148",plugin: "animate",option: {}},
{container: "si_80000163",plugin: "animate",option: {}},
{container: "si_80000167",plugin: "animate",option: {}},
],
};
(function () {
window.FX = window.FX || {};
var paths = [
'core/interface.js',
'core/fx.js',
'core/utils.js',
'plugins/animate.js',
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
