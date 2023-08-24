/*! npm.im/object-fit-images 3.2.3 */
var objectFitImages=function(){"use strict";function t(t,e){return"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='"+t+"' height='"+e+"'%3E%3C/svg%3E"}function e(t){if(t.srcset&&!m&&window.picturefill){var e=window.picturefill._;t[e.ns]&&t[e.ns].evaled||e.fillImg(t,{reselect:!0}),t[e.ns].curSrc||(t[e.ns].supported=!1,e.fillImg(t,{reselect:!0})),t.currentSrc=t[e.ns].curSrc||t.src}}function i(t){for(var e,i=getComputedStyle(t).fontFamily,r={};null!==(e=l.exec(i));)r[e[1]]=e[2];return r}function r(e,i,r){var n=t(i||1,r||0);p.call(e,"src")!==n&&b.call(e,"src",n)}function n(t,e){t.naturalWidth?e(t):setTimeout(n,100,t,e)}function c(t){var c=i(t),o=t[a];if(c["object-fit"]=c["object-fit"]||"fill",!o.img){if("fill"===c["object-fit"])return;if(!o.skipTest&&g&&!c["object-position"])return}if(!o.img){o.img=new Image(t.width,t.height),o.img.srcset=p.call(t,"data-ofi-srcset")||t.srcset,o.img.src=p.call(t,"data-ofi-src")||t.src,b.call(t,"data-ofi-src",t.src),t.srcset&&b.call(t,"data-ofi-srcset",t.srcset),r(t,t.naturalWidth||t.width,t.naturalHeight||t.height),t.srcset&&(t.srcset="");try{s(t)}catch(t){window.console&&console.warn("https://bit.ly/ofi-old-browser")}}e(o.img),t.style.backgroundImage='url("'+(o.img.currentSrc||o.img.src).replace(/"/g,'\\"')+'")',t.style.backgroundPosition=c["object-position"]||"center",t.style.backgroundRepeat="no-repeat",t.style.backgroundOrigin="content-box",/scale-down/.test(c["object-fit"])?n(o.img,function(){o.img.naturalWidth>t.width||o.img.naturalHeight>t.height?t.style.backgroundSize="contain":t.style.backgroundSize="auto"}):t.style.backgroundSize=c["object-fit"].replace("none","auto").replace("fill","100% 100%"),n(o.img,function(e){r(t,e.naturalWidth,e.naturalHeight)})}function s(t){var e={get:function(e){return t[a].img[e||"src"]},set:function(e,i){return t[a].img[i||"src"]=e,b.call(t,"data-ofi-"+i,e),c(t),e}};Object.defineProperty(t,"src",e),Object.defineProperty(t,"currentSrc",{get:function(){return e.get("currentSrc")}}),Object.defineProperty(t,"srcset",{get:function(){return e.get("srcset")},set:function(t){return e.set(t,"srcset")}})}function o(t,e){var i=!h&&!t;if(e=e||{},t=t||"img",f&&!e.skipTest||!d)return!1;"img"===t?t=document.getElementsByTagName("img"):"string"==typeof t?t=document.querySelectorAll(t):"length"in t||(t=[t]);for(var r=0;r<t.length;r++)t[r][a]=t[r][a]||{skipTest:e.skipTest},c(t[r]);i&&(document.body.addEventListener("load",function(t){"IMG"===t.target.tagName&&o(t.target,{skipTest:e.skipTest})},!0),h=!0,t="img"),e.watchMQ&&window.addEventListener("resize",o.bind(null,t,{skipTest:e.skipTest}))}var a="bfred-it:object-fit-images",l=/(object-fit|object-position)\s*:\s*([-\w\s%]+)/g,u="undefined"==typeof Image?{style:{"object-position":1}}:new Image,g="object-fit"in u.style,f="object-position"in u.style,d="background-size"in u.style,m="string"==typeof u.currentSrc,p=u.getAttribute,b=u.setAttribute,h=!1;return o.supportsObjectFit=g,o.supportsObjectPosition=f,function(){function t(t,e){return t[a]&&t[a].img&&("src"===e||"srcset"===e)?t[a].img:t}f||(HTMLImageElement.prototype.getAttribute=function(e){return p.call(t(this,e),e)},HTMLImageElement.prototype.setAttribute=function(e,i){return b.call(t(this,e),e,String(i))})}(),o}();

    function applyOFI(forced, viaUrl) {
        var btn = document.querySelector('button');
        btn.disabled = true;
        objectFitImages(false, {
            watchMQ: true,
            skipTest: forced
        });
        if (objectFitImages.supportsObjectPosition) {
            btn.innerHTML = 'Fix applied anyway' + (viaUrl ? ' via URL' : '');
        } else {
            btn.innerHTML = 'Fix applied';
        }
    }

    // applyOFI(true, true);

// ------
jQuery(function() {
    jQuery('#audio2_html5_black').audio2_html5({
        skin: 'blackControllers',
        autoPlay:true,
        initialVolume:0.5,
        showRewindBut:true,
        showShuffleBut:true,
        showDownloadBut:false,
        showFacebookBut:false,
        showTwitterBut:false,
        showLyricsBut: false,
        searchInputText: 'Rechercher ...',
        showBuyBut: false,
        responsive:true,    
        shuffle:false,
        playerBg: '#ffca27',
        bufferEmptyColor: '#737373',
        bufferFullColor: '#bababa',
        seekbarColor: '#000000',
        volumeOffColor: '#bababa',
        volumeOnColor: '#000000',
        timerColor: '#000000',
        songTitleColor: '#000000',
        songAuthorColor: '#484848',        
        bordersDivColor: '#ca9800',        
        playlistTopPos:0,
        playlistBgColor:'#eeeeee',
        playlistRecordBgOffColor:'#FFFFFF',
        playlistRecordBgOnColor:'#cccccc',
        playlistRecordBottomBorderOffColor:'#cccccc',
        playlistRecordBottomBorderOnColor:'#555555',
        playlistRecordTextOffColor:'#777777',
        playlistRecordTextOnColor:'#000000',        
        categoryRecordBgOffColor:'#ffca27',
        categoryRecordBgOnColor:'#cccccc',
        categoryRecordBottomBorderOffColor:'#ca9800',
        categoryRecordBottomBorderOnColor:'#ca9800',
        categoryRecordTextOffColor:'#4c4c4c',
        categoryRecordTextOnColor:'#000000',        
        selectedCategBg: '#ffca27',
        selectedCategOffColor: '#000000',
        selectedCategOnColor: '#f90000',
        selectedCategMarginBottom:12,        
        searchAreaBg: '#ffca27',
        searchInputBg:'#000000',
        searchInputBorderColor:'#ffca27',
        searchInputTextColor:'#cccccc'
    });     
    
    
});
	    
    

jQuery(document).ready(function(){  
    var cible = jQuery("a[href='#top']"); 
    cible.click(function() {
        jQuery("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > 50) { cible.fadeIn(); } else { cible.fadeOut(); }
    });

    // Donation
    jQuery("input[type=radio]").click(function () {
        if(jQuery('#other_price:checked').prop("checked")) {
            jQuery('.li_donate').show();
            jQuery('#free_amount').attr('required', true);
        }
        else {
            jQuery('.li_donate').hide();
            jQuery('#free_amount').attr('required', false);
        }
    });

    // jQuery('#main_filter').collapse();

    $('[data-toggle="tooltip"]').tooltip();

    // validation
    jQuery("#form_testi").validationEngine();

    // validation
    jQuery("#form_donate").validationEngine();

    // validation
    jQuery(".form_download_link").validationEngine();
    
    // popup right
    jQuery('.close_pop').click(function(){
        jQuery('.popup_right').animate( {'right': -300}, 1500 , function() {
          jQuery('.popup_right').hide();
        })
    })



});

