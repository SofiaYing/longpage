﻿var fx_options = {
"0": [{container: "si_800001C2",plugin: "animation",option: {}},
{container: "si_800001CE",plugin: "animation",option: {}},
{container: "si_80000116",plugin: "uiTextBox",option: {}},
{container: "si_80000181",plugin: "animation",option: {}},
{container: "buttonItem-11",plugin: "button",option: {}},
],
"1": [{container: "buttonItem-38",plugin: "button",option: {}},
{container: "buttonItem-39",plugin: "button",option: {}},
{container: "buttonItem-40",plugin: "button",option: {}},
{container: "buttonItem-41",plugin: "button",option: {}},
{container: "buttonItem-42",plugin: "button",option: {}},
{container: "buttonItem-43",plugin: "button",option: {}},
{container: "buttonItem-44",plugin: "button",option: {}},
],
"2": [{container: "si_8000012D",plugin: "uiTextBox",option: {}},
],
"3": [{container: "si_80000145",plugin: "uiTextBox",option: {}},
],
"4": [{container: "si_800000D4",plugin: "uiTextBox",option: {}},
],
"5": [{container: "si_8000009C",plugin: "uiTextBox",option: {}},
],
"6": [{container: "si_80000107",plugin: "uiTextBox",option: {}},
],
"7": [{container: "si_80000130",plugin: "uiTextBox",option: {}},
],
};
(function () {
window.FX = window.FX || {};
var paths = [
'core/interface.js',
'core/fx.js',
'core/utils.js',
'plugins/animation.js',
'plugins/uiTextBox.js',
'plugins/button.js',
'plugins/animate.css',
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
