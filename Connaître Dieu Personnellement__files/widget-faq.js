$(function () {

    $('#accordion').on('show.bs.collapse', function (e) {
        jQuery(this).find(".panel-title i").removeClass("icomoon-arrow-up-2").addClass("icomoon-arrow-down-2");
        if (!jQuery(e.target).hasClass(".in").length) {
            jQuery(e.target).parent().find(".chevron").removeClass("icomoon-arrow-down-2").addClass("icomoon-arrow-up-2").parent().addClass("open");
        }
    });

    $('#accordion').on('hide.bs.collapse', function (e) {
        if (!jQuery(e.target).hasClass(".in").length) {
            jQuery(e.target).parent().find(".chevron").removeClass("icomoon-arrow-up-2").addClass("icomoon-arrow-down-2").parent().removeClass("open");
        }
    });

});