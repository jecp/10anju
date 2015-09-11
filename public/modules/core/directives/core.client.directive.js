'use strict';
/**
 * 动态加载js文件文件
 * @param url
 * @param callback
 */
function addScript(url,callback){
    var elt = document.createElement('script');
    elt.src = url;
    elt.anysc = true;
    if(elt.onload===null){
        elt.onload = function(){
            typeof callback==='function'&&callback();
        };
    }else{
        elt.onreadystatechange = function(){
            if(elt.readyState==='loaded' || elt.readyState==='complete'){
                typeof callback==='function'&&callback();
            }
        };
    }
    document.getElementsByTagName('body')[0].appendChild(elt);
};
