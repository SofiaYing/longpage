var fx_options = {
"0": [{container: "si_80000150",plugin: "animation",option: {}},
{container: "si_8000014D",plugin: "animation",option: {}},
{container: "si_80000157",plugin: "animation",option: {}},
{container: "si_800000F9",plugin: "animation",option: {}},
{container: "si_800000F5",plugin: "animation",option: {}},
{container: "si_8000015D",plugin: "animation",option: {}},
{container: "si_80000170",plugin: "animation",option: {}},
{container: "si_80000119",plugin: "animation",option: {}},
{container: "si_8000016A",plugin: "animation",option: {}},
{container: "si_8000011C",plugin: "animation",option: {}},
{container: "si_8000011F",plugin: "animation",option: {}},
{container: "si_80000164",plugin: "animation",option: {}},
{container: "si_80000176",plugin: "animation",option: {}},
],
"1": [{container: "si_8000012C",plugin: "animation",option: {}},
],
};
(function () {
window.FX = window.FX || {};
var paths = [
'core/interface.js',
'core/fx.js',
'core/utils.js',
'plugins/animation.js',
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
