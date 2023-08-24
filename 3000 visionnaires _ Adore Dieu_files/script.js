jQuery(function(){
	//if(jQuery("#campagne-modal").length)
	if( jQuery("#campagne-modal").length && !pdc_getCookie('pcd-opened') )
    	pdc_showModal();
});

function pdc_showModal(){
    setTimeout(function(){ 
        jQuery("#campagne-modal").modal('show');

		// Video 
		var list_video = jQuery("#campagne-modal .thumb_donate"); 
		var first_li = jQuery('#campagne-modal').find('.thumb_donate').eq(0);
		var first_li_url = first_li.attr("movieurl");
		var url_not_play = first_li_url.replace("?autoplay=1" , "");

		jQuery("#videoarea_second").attr({
			"src": url_not_play,
			"poster": ""
		})
		list_video.removeClass('current_playing');
		first_li.addClass('current_playing');

		
		list_video.on("click", function(e) {
			// console.log(e.currentTarget);
			jQuery("#videoarea_second").attr({
				"src": jQuery(this).attr("movieurl"),
				"poster": "",
				"autoplay": "autoplay"
			})
			list_video.removeClass('current_playing');
			jQuery(this).addClass('current_playing');
			jQuery("#videoarea_second").attr('style','');
        });
		
        pdc_setCookie('pcd-opened',true) 
    }, 5000);
}

function pdc_setCookie(cname, cvalue) {
     var d = new Date();
     //var delay = 24*60*60*1000;
	 var delay = 30*60*1000;
     d.setTime(d.getTime() + delay);
     var expires = "expires="+ d.toUTCString();
     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function pdc_getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}