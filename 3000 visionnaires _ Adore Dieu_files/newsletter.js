$('#newsForm').validate({
	rules: {
		name: "required",
		email: {
			required: true,
			email: true
		}
	},

    submitHandler: function(form) {
		$.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {
	                action : 'newsletter',
	                formData : $(form).serialize()
	            },
	            beforeSend: function(response) {
                    $(".sendbtn").addClass('load');
                    $("#result").hide();
                },
                success: function(response) {
                	$(".sendbtn").removeClass('load');
                    $("#result").html(response).slideDown();
                    $('input[name="email"]').val('');
                    $('input:checkbox').removeAttr('checked');
                }

            });
    }
});


// Slider partenaire
var exist5 = $('.slider_bpartner').length
if (exist5) {
    $('.slider_bpartner').slick({
        dots:false,
        infinite:true,
        autoplaySpeed:2500,
        slide: '.item_sbp',
        speed:500,
        cssEase:'linear',
        arrows:false,
        autoplay:true,
        slidesToScroll: 1,
        slidesToShow: 6,
        responsive: [
            {
              breakpoint: 1023,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              }
            },
            {
              breakpoint: 380,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              }
            }
        ] 

    }); 
}

// Slider partenaire
var exist6 = $('.pub_down').length
if (exist6) {
    $('.pub_down').slick({
        dots:false,
        infinite:true,
        autoplaySpeed:10000,
        slide: '.item_pub_dow',
        speed:1000,
        cssEase:'linear',
        arrows:false,
        autoplay:true,
        slidesToScroll: 1,
        slidesToShow: 1,        

    }); 
}