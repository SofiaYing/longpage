var fx_options = {
"0": [{container: "si_80000165",plugin: "animation",option: {}},
{container: "si_80000168",plugin: "animation",option: {}},
{container: "si_80000173",plugin: "uiImageBox",option: {}},
{container: "si_800001CF",plugin: "uiButton",option: {}},
],
"1": [{container: "buttonItem-40",plugin: "button",option: {}},
{container: "buttonItem-41",plugin: "button",option: {}},
{container: "buttonItem-42",plugin: "button",option: {}},
{container: "buttonItem-43",plugin: "button",option: {}},
],
"2": [{container: "si_800001F5",plugin: "uiImageBox",option: {}},
{container: "buttonItem-57",plugin: "button",option: {}},
],
"3": [{container: "si_8000014B",plugin: "uiImageBox",option: {}},
{container: "buttonItem-71",plugin: "button",option: {}},
],
"4": [{container: "si_80000157",plugin: "uiImageBox",option: {}},
{container: "buttonItem-85",plugin: "button",option: {}},
],
"5": [{container: "si_800000FA",plugin: "uiImageBox",option: {}},
{container: "buttonItem-99",plugin: "button",option: {}},
],
};
(function () {
window.FX = window.FX || {};
var paths = [
'core/interface.js',
'core/fx.js',
'core/utils.js',
'plugins/animation.js',
'plugins/uiImageBox.js',
'plugins/uiButton.js',
'plugins/button.js',
'plugins/animate.css',
'plugins/cropper.min.css',
'plugins/cropper.min.js',
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
