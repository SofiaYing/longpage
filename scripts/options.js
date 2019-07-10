var fx_options = {
"0": [{container: "dynamicImageItem-4",plugin: "dynamicImage",option: {}},
{container: "dynamicImageItem-5",plugin: "dynamicImage",option: {}},
{container: "dynamicImageItem-6",plugin: "dynamicImage",option: {}},
{container: "dynamicImageItem-7",plugin: "dynamicImage",option: {}},
{container: "dynamicImageItem-8",plugin: "dynamicImage",option: {}},
{container: "dynamicImageItem-9",plugin: "dynamicImage",option: {}},
],
};
(function () {
window.FX = window.FX || {};
var paths = [
'core/interface.js',
'core/fx.js',
'core/utils.js',
'plugins/dynamicImage.js',
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
