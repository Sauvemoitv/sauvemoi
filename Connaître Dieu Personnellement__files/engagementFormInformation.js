jQuery(function () {
    // gestion des messages d'information
    jQuery("body").on("click", ".information-button", function () {
        jQuery(this).parent().next(".information-panel").removeClass("hide");
        jQuery(this).addClass("selected");
    });
    jQuery("body").on("click", ".information-panel .close", function () {
        jQuery(this).parent().addClass("hide");
        jQuery(this).parent().prev(".information-header").find(".information-button").removeClass("selected");
    });
});