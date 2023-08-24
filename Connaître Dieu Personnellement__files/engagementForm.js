function promode() {
    jQuery("#contactConnexionWrapper").removeClass('hide'); /* Genial git craker */
}

var hasDecidedWayOfPaymentLevy = false;
var hasDecidedWayOfPaymentDebit = false;

function getAllUrlParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramName = a[0];
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
            if (paramName.match(/\[(\d+)?\]$/)) {
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];
                if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    obj[key].push(paramValue);
                }
            } else {
                if (!obj[paramName]) {
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}

function isNumeric(num) {
    var exp = new RegExp("^[\+0-9\.]*$", "g");
    return exp.test(num);
}

function formatAmount(ch) {
    if (ch) {
        var ch = ch.replace(/ /g, "");//remove space
        ch = ch.replace(/-/g, "");//remove space
        ch = ch.replace(/,/g, ".");//replace . by ,
        ch = ch.replace(/\.0/g, "");//replace . by ,
        if (!isNumeric(ch) || ch < 0) {
            ch = '';
        }
        return ch;
    }
}

function OnAmountChange(amount) {

}

function updateAmount() {
    var other = jQuery(".suggested-amount-button[value='other']");
    var btn = jQuery(".suggested-amount-button[value='" + engagementFormStore.amount + "']");

    if (btn.length) {
        btn.siblings().removeClass('selected');
        btn.addClass("selected");
        jQuery("#groupAmount").addClass('hide');
    } else {
        other.siblings().removeClass('selected');
        other.addClass("selected");
        jQuery("#groupAmount").removeClass('hide');
        jQuery("#groupAmount label").addClass('completion');
    }
    showRecurData();
}

function updateRadio(name, value) {
    var list = jQuery("#" + name);
    list.find('.radio').removeClass('fa-dot-circle radio-on').addClass('fa-circle radio-off');
    list.find('[data-value="' + value + '"] .radio').removeClass('fa-circle radio-off').addClass('fa-dot-circle radio-on');
}

function updateCheckbox(name, value) {
    var toggle = jQuery("#" + name).find(".check");

    if (value) {
        toggle.removeClass('fa-square check-off').addClass('fa-check-square check-on');
    } else {
        toggle.removeClass('fa-check-square check-on').addClass('fa-square check-off');
    }
}

function formatDate(date) {
    var monthNames = [
        "janvier", "février", "mars",
        "avril", "mai", "juin", "juillet",
        "août", "septembre", "octobre",
        "novembre", "décembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
}

function calculDateBirthPayment(idModePayment, day, month, year) {

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (day == null) day = today.getDay();
    if (month == null) month = today.getMonth();
    if (year == null) year = today.getFullYear();

    var dateBirth = new Date(year, month, day);
    var safeDate = new Date();

    switch (idModePayment) {
        // Prélèvement automatique
        case '10':
            safeDate.setDate(today.getDate() + 5);
            safeDate.setHours(0, 0, 0, 0);
            if (dateBirth < safeDate) {
                var nextMonth = month + 1;
                if (nextMonth > 11) {
                    nextMonth = 0;
                    year = year + 1;
                    dateBirth.setFullYear(year)
                }
                dateBirth.setMonth(nextMonth);
            }
            break;

        // Debit autorisé
        case '19':
            safeDate.setDate(today.getDate() + 3);
            safeDate.setHours(0, 0, 0, 0);
            if (dateBirth < safeDate) {
                var nextMonth = month + 1;
                
                if (nextMonth > 11) {
                    nextMonth = 0;
                    year = year + 1;
                    dateBirth.setFullYear(year)
                }
                dateBirth.setMonth(nextMonth);
            }
            break;

        // Chq
        case '2':
            safeDate.setDate(today.getDate() + 3);
            safeDate.setHours(0, 0, 0, 0);
            if (dateBirth < safeDate) {
                var nextMonth = month + 1;
                if (nextMonth > 11) {
                    nextMonth = 0;
                    year = year + 1;
                    dateBirth.setFullYear(year)
                }
                dateBirth.setMonth(nextMonth);
            }
            break;

        default:
            safeDate.setDate(today.getDate());
            safeDate.setHours(0, 0, 0, 0);
            if (dateBirth < safeDate) {
                var nextMonth = month + 1;
                if (nextMonth > 11) {
                    nextMonth = 0;
                    year = year + 1;
                    dateBirth.setFullYear(year)
                }
                dateBirth.setMonth(nextMonth);
            }
            break;
    }


    var diffTime = Math.abs(dateBirth.getTime() - today.getTime());
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {dateBirth: formatDate(dateBirth), diffDays: diffDays};

}

jQuery('body').on("click", ".confirm-button-debit", function () {
    selectDebit();
});
jQuery('body').on("click", ".confirm-button-levy", function () {
    selectLevy();
});

// gestion des radio message cliques
jQuery('body').on("click", ".check-group .group-message", function () {
    jQuery(this).siblings("i.check").trigger("click");
});

jQuery('body').on("click", ".toggle-group .group-message", function () {
    jQuery(this).siblings("i.toggle").trigger("click");
});

jQuery('body').on("click", ".radio-group .group-message", function () {
    jQuery(this).siblings("i.radio").trigger("click");
});


jQuery('body').on("change", ".label-in-input input", function () {
    // garde l'état focus d'un champ input quand le champ est non-vide
    if (jQuery(this).val() != '') {
        jQuery(this).siblings("label").addClass('completion');
    } else {
        jQuery(this).siblings("label:not('.label-country')").removeClass('completion');
    }

    // on enlève le rouge de l'erreur si un champ est modifié
    if (jQuery(this).attr('id') != 'account_iban' && jQuery(this).attr('id') != 'userEmailConfirm') {
        jQuery(this).parents(".label-in-input").removeClass("has-error");
    }
});

// garde l'état focus d'un champ textarea quand le champ est non-vide
jQuery("body").on("focus", ".label-in-input textarea", function () {
    (jQuery(this).val() == '') ? jQuery(this).addClass("completion") : "";
}).on("blur", ".label-in-input textarea", function () {
    if (jQuery(this).val() == '') {
        jQuery(this).removeClass("completion");
        jQuery(this).siblings("label:not('.label-country')").removeClass('completion');
    } else {
        jQuery(this).addClass("completion");
        jQuery(this).siblings("label").addClass('completion');
        jQuery(this).closest('.form-group.has-error').removeClass('has-error');
    }
});


function showOtherAmountField(btn) {
    jQuery('#groupAmount').removeClass("hide");
    btn.siblings(".suggested-amount-button").removeClass("selected");
    btn.addClass("selected");
}

// gestion du montant don
jQuery("#suggestedAmountWrapper").on("click", '.suggested-amount-button', function () {
    var amount = '';
    jQuery(this).siblings(".suggested-amount-button").removeClass("selected");
    jQuery(this).addClass("selected");
    jQuery('#contributionAmount ~ label').addClass("completion");
    if (jQuery(this).val() == 'other') {
        /*jQuery('#groupAmountSuggestion').addClass("hide");*/
        jQuery('#groupAmount').removeClass("hide");
        jQuery('#contributionAmount').val("");
        jQuery('#contributionAmount').focus();
    } else {
        amount = jQuery(this).val();
        jQuery('#contributionAmount').val(amount);
        jQuery('#groupAmount').addClass("hide");

    }
    engagementFormSetValue('amount', amount);
    engagementFormSync();
    modeSpecific(engagementFormStore.meanPayment);
    showRecurData();
});


//jQuery(function () {


/* clean format amount */
jQuery(':input[name="amount"]').keyup(function () {
    var amountValue = jQuery('#contributionAmount').val();
    amountValue = formatAmount(amountValue);
    if (amountValue != jQuery(this).val()) {
        jQuery(this).val(amountValue);
    }
    engagementFormSetValue('amount', amountValue);
    engagementFormSync();
    showRecurData();
});


jQuery("#meanPaymentWrapper ").on("click", '.payment-way-button:not(".selected")', function (e) {
    showWayOfContribution(this, e, true);
});


//jQuery("#groupOrganization input").on("blur", function () {
//if (jQuery(this).val() == "") showOrganization(false);
//});

// changement du pays dans les messages
jQuery("#groupBankingDomiciliation select").on("change", function () {
    jQuery('.payment-panel .country').html(jQuery(this).find('option:selected').text());
});

// changement de l'adresse pour le magazine
jQuery("#addressPanel button.save").on("click", function () {
    validateAddress(true);
});

// par défaut mettre le label des champs de type select en mode completion
jQuery("select").siblings("label").addClass('completion');

// par défaut mettre le label du champs account_iban en mode completion
jQuery("#account_iban").siblings("label").addClass('completion');

jQuery('#validateBtn').addClass('inactive');
if (jQuery('.payment-way-button').not('#MeanButton999').hasClass('selected')) {
    jQuery('#validateBtn').removeClass('inactive');
}


//});

function showPartner(_r) {
    if (!_r) { /* ponctual */
        jQuery('.partnershipRef').addClass('hide');
        jQuery('.contribution-type').html('don');
        jQuery('#groupFrequency').addClass("hide");
    } else { /* monthly */
        jQuery('.partnershipRef').removeClass('hide');
        jQuery('.contribution-type').html('don mensuel');
        jQuery('#groupFrequency').removeClass("hide");
    }
}

function isPartnership(_r) {

    engagementFormSetValue('isPartner', _r);
    engagementFormSetValue('meanPayment', 0);
    showPartner(_r);
    engagementFormSync();

    engagementShowMeanButtons(engagementFormStore.country);
    engagementHideMeanDetails();

    if (engagementFormStore.isCampaign) {
        updateAmounts(projects[engagementFormStore.project_id].suggestedAmounts[engagementFormStore.currency], engagementFormStore.currency);
    } else {
        updateAmounts(defaultAmounts[engagementFormStore.isPartner ? 'unlimited' : 'once'][engagementFormStore.currency], engagementFormStore.currency);
    }

    //engagementFormSubmit(engagementFormController, 'setPartner');

}

function showOrganization(_r) {
    (_r) ? jQuery('#groupOrganizationName').removeClass('hide') : jQuery('#groupOrganizationName').addClass('hide');

}

function isOrganization(_r) {
    engagementFormStore.isOrganization = _r ? 1 : 0;
    showOrganization(_r);
    engagementFormSync();
}


var showWayOfContribution = function (_this, _e, _r) {
    if (jQuery(_this).is("a")) {
        console.log("LINK");
    } else {
        if (typeof _e == 'object') {
            _e.preventDefault();
            _e.stopPropagation();
        }
        var $this = jQuery(_this);


        if (_r) {
            engagementFormSetValue('meanPayment', $this.data('mean-id'));
            //$this.siblings(".payment-way-button").removeClass("selected").addClass("hide");
            $this.siblings(".payment-way-button").removeClass("selected");
            $this.addClass("selected");
            jQuery('.payment-panel').addClass("hide");
            //jQuery('#' + $this.attr('id').slice(0, -6) + "Panel").removeClass("hide");
            if ($this.data('mean-id') != 999) {
                jQuery('#validateBtn').removeClass("inactive");
                jQuery('#validateLoader').addClass("hide");
                engagementFormSetValue('noCorrectMean', false);
            } else {
                engagementFormSetValue('noCorrectMean', true);
            }
        } else {
            engagementFormSetValue('meanPayment', 0);
            jQuery(".payment-way-button").removeClass("selected"); //.removeClass("hide");
            jQuery('.payment-panel').addClass("hide");
            jQuery('#validateBtn').addClass("inactive");
        }
        //  engagementFormSubmit(engagementFormController, 'setMean');
        engagementShowMeanDetails($this.data('mean-id'));
        engagementFormSync();
        // inaction si aucun moyen de contribution ne convient
        if ($this.data('mean-id') == 999) {
            jQuery('#validateBtn').addClass('inactive')
        } else {
            jQuery('#validateBtn').removeClass('inactive');

            var msgFooterHtml = " est le moyen le + sécurisé, le + économique (faible commission) et le + pratique pour notre gestion. " +
                "Très simple à mettre en oeuvre pour vous, tout se fait en ligne en moins de 2 minutes " +
                " et vous pourrez à tout moment arrêter ou modifier votre soutien par un simple email ou appel téléphonique à EMCI ou à votre banque.";
            if ($this.siblings('.payment-way-button').attr('data-mean-id') == 1) {
                if (!hasDecidedWayOfPaymentLevy) {
                    Swal.fire({
                        title: '<strong>Accepteriez-vous de donner par <u>prélèvement automatique</u> ?</strong>',
                        type: 'question',
                        html: 'Plus de 70% de nos donateurs ont fait ce choix et nous les remercions.',
                        footer: '&#9786; Le prélèvement automatique ' + msgFooterHtml,
                        showCloseButton: true,
                        showCancelButton: true,
                        customClass: {
                            container: 'container-class',
                            popup: 'popup-class',
                            header: 'header-class',
                            title: 'title-class',
                            closeButton: 'close-button-class',
                            image: 'image-class',
                            content: 'content-class',
                            input: 'input-class',
                            actions: 'actions-class',
                            confirmButton: 'confirm-button-class',
                            cancelButton: 'cancel-button-class',
                            footer: 'footer-class'
                        },
                        focusConfirm: false,
                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Oui avec plaisir',
                        confirmButtonAriaLabel: "J'accepte",
                        cancelButtonText: 'Non merci',
                        cancelButtonAriaLabel: 'Non merci',
                    }).then(function (result) {
                        if (result.value) {
                            selectLevy();
                        }
                    });
                    hasDecidedWayOfPaymentLevy = true;
                }
            } else if ($this.siblings('.payment-way-button').attr('data-mean-id') == 30) {
                if (!hasDecidedWayOfPaymentDebit) {
                    Swal.fire({
                        title: '<strong>Accepteriez-vous de donner par <u>débit préautorisé</u> ?</strong>',
                        type: 'question',
                        html: 'Plus de 70% de nos donateurs ont fait ce choix et nous les remercions.',
                        footer: '&#9786; Le débit préautorisé ' + msgFooterHtml,
                        showCloseButton: true,
                        showCancelButton: true,
                        customClass: {
                            container: 'container-class',
                            popup: 'popup-class',
                            header: 'header-class',
                            title: 'title-class',
                            closeButton: 'close-button-class',
                            image: 'image-class',
                            content: 'content-class',
                            input: 'input-class',
                            actions: 'actions-class',
                            confirmButton: 'confirm-button-class',
                            cancelButton: 'cancel-button-class',
                            footer: 'footer-class'
                        },
                        focusConfirm: false,
                        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Oui avec plaisir',
                        confirmButtonAriaLabel: "J'accepte",
                        cancelButtonText: 'Non merci',
                        cancelButtonAriaLabel: 'Non merci',
                    }).then(function (result) {
                        if (result.value) {
                            selectDebit();
                        }
                    });
                    hasDecidedWayOfPaymentDebit = true;
                }
            } else if (isSwissCHF()) {
                showAlertCHF(_e);
            }

        }


    }
};

function isSwissCHF() {
    return (engagementFormStore.meanPayment == 48 || engagementFormStore.meanPayment == 47)
        && engagementFormStore.currency === 'CHF';
}

function isTransfer() {
    return donationData.means.all[engagementFormStore.meanPayment].mode == 4;
}

var needAlertCHF = false;

var showAlertCHF = function (_e, callback = false, callbackClose = false) {
    Swal.fire({
        title: '<strong>Accepteriez-vous de donner <u>en&nbsp;EUROS</u> ?</strong>',
        type: 'question',
        html: '<p>Des frais bancaires importants sont appliqués lors des virements faits en ' +
            'devise CHF vers notre compte en France. Ces frais peuvent représenter jusqu’à la moitié ' +
            'du montant de votre don. Afin d\'éviter ces frais, nous souhaitons convertir votre don en EUROS.',

        showCloseButton: true,
        showCancelButton: true,
        customClass: {
            container: 'container-class',
            popup: 'popup-class',
            header: 'header-class',
            title: 'title-class',
            closeButton: 'close-button-class',
            image: 'image-class',
            content: 'content-class',
            input: 'input-class',
            actions: 'actions-class',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class',
            footer: 'footer-class'
        },
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> J\'ai compris',
        confirmButtonAriaLabel: "J'accepte de donner en EUROS",
        cancelButtonText: 'Je préfère donner en CHF par carte bancaire',
        cancelButtonAriaLabel: 'Je préfère donner en CHF par carte bancaire',
    }).then(function (result) {
        if (result.value) {
            jQuery.getJSON("https://emcitv.com/don/currency/convert/" + engagementFormStore.amount + "/CHF/EUR/", function (response) {
                var newAmount = response.data.converted;
                updateEngagementAmount(newAmount);
                engagementFormSetValue("amount", newAmount);
                jQuery("input[name=amount]").val(newAmount);
            });
            engagementChangeCurrency('EUR');
            needAlertCHF = false;
            if (callback) {
                callback();
            }
        } else if (result.dismiss && result.dismiss === 'cancel') {
            var otherWay = jQuery("#meanPaymentWrapper button:visible:first-child");
            showWayOfContribution(otherWay, _e, true);
            needAlertCHF = false;
            if (callback) {
                callback();
            }
        } else {
            needAlertCHF = true;
            if (callbackClose) {
                callbackClose();
            }
        }
    });
};
var needAlertTransfer = false;

var showAlertTransfer = function (_e, callback = false, callbackClose = false) {
    var amount = engagementFormStore.amount ? engagementFormStore.amount : "0";
    Swal.fire({
        title: '',
        type: 'info',
        html: 'Je vais faire un don de <strong class="t-amount">' +
            amount + ' ' + engagementFormStore.currency + '</strong><div class="t-freq">' +
            (engagementFormStore.isPartner ? " MENSUELLEMENT " : " EN UNE FOIS ") +
            '</div> À partir du pays suivant : <strong class="t-country">' + donationData.countries[engagementFormStore.country].name + "</strong>",
        showCloseButton: true,
        showCancelButton: true,
        customClass: {
            container: 'container-class',
            popup: 'popup-class',
            header: 'header-class',
            title: 'title-class',
            closeButton: 'close-button-class',
            image: 'image-class',
            content: 'content-class popup-transfer',
            input: 'input-class',
            actions: 'actions-class',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class',
            footer: 'footer-class'
        },
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Oui, je valide',
        confirmButtonAriaLabel: "Je valide mon don par virement bancaire",
        cancelButtonText: 'Non, je veux corriger le formulaire',
        cancelButtonAriaLabel: 'je veux corriger le formulaire',
    }).then(function (result) {
        if (result.value) {
            if (callback) {
                callback();
            }
        } else if (result.dismiss && result.dismiss === 'cancel') {
            if (callbackClose) {
                callbackClose();
            }
        } else {
            if (callbackClose) {
                callbackClose();
            }
        }
    });
};

var engagementFormStore = {
    'init': false
};
var engagementFormController = '';


function engagementUpdateCurrencyLabel(code) {
    jQuery(".currency-current-label").html(currencyDisplayLabels[code]);
}

function engagementChangeCurrency(code) {
    if (engagementFormStore.currency !== 'CHF' && code === 'CHF') {
        needAlertCHF = isSwissCHF();
    }
    engagementFormSetValue('currency', code);
    engagementUpdateCurrencyLabel(code);

    if (engagementFormStore.isCampaign) {
        updateAmounts(projects[engagementFormStore.project_id].suggestedAmounts[engagementFormStore.currency], engagementFormStore.currency);
    } else {
        updateAmounts(defaultAmounts[engagementFormStore.isPartner ? 'unlimited' : 'once'][engagementFormStore.currency], engagementFormStore.currency);
    }

    engagementFormSync();
    modeSpecific(engagementFormStore.meanPayment);
    if (engagementFormStore.amount != "") {
        jQuery("button.suggested-amount-button[value='" + engagementFormStore.amount + "']").addClass("selected");
    }
    //engagementFormSubmit(engagementFormController, "setCurrency");
}

function engagementUnsetUser() {
    engagementFormStore.userToken = '';
    engagementFormSubmit(engagementFormController, "setUserToken");
}

function engagementFormSetValue(key, value) {
    engagementFormStore[key] = value;
}

function engagementFormSync() {
    engagementFormSubmit(engagementFormController, 'sync');

}

function engagementCollectData(form) {
    $("input,select,textarea", form).each(function (k, input) {
        engagementFormSetValue($(input).attr("name"), $(input).val());
    });
    if (typeof holder_phone_input != 'undefined') {
        engagementFormSetValue('holder_phone', holder_phone_input.getNumber());
    }
}

function engagementFormSubmit(url, handler) {
    engagementCollectData(jQuery("#" + engagementFormId));

    if (handler === 'sync' && typeof (Storage) !== "undefined") {
        sessionStorage.engagementFormData = JSON.stringify(engagementFormStore);
        return;
    }

    console.log("submit...");

    dorcas.ajax(url + ":" + handler, {
        type: 'POST',
        cache: false,
        data: JSON.stringify(engagementFormStore),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    })
        .done(function (response) {
            console.log("submit done...");
            if (typeof response.data.engagementData !== 'undefined') {
                if (typeof response.data.engagementData != 'undefined')
                    engagementFormStore = response.data.engagementData;
                engagementUpdateCurrencyLabel(engagementFormStore.currency);
                if (!engagementFormStore.meanPayment) {
                    jQuery('#validateBtn').addClass("inactive");
                }
            }
        })
        .fail(function (response) {
            console.log("fail..." + response.data);
        });
}

function engagementFormValidate(_t) {
    var $t = jQuery(_t);
    if ($t.hasClass('inactive')) return;
    jQuery('#validateBtn').addClass("inactive");

    jQuery(".error-container").addClass('hide');
    removeAllEngagementErrors();

    $("#validateLoader").removeClass("hide");

    if (needAlertCHF || isSwissCHF()) {
        showAlertCHF('', function () {
            engagementFormSubmit(engagementFormController, 'submit');
        }, function () {
            jQuery('#validateBtn').removeClass("inactive");
            jQuery('#validateLoader').addClass("hide");
        });
        return;
    }

    /*
    if (isTransfer()) {
        showAlertTransfer('', function () {
            engagementFormSubmit(engagementFormController, 'submit');
        }, function () {
            jQuery('#validateBtn').removeClass("inactive");
            jQuery('#validateLoader').addClass("hide");
        });
        return;
    }
     */

    engagementFormSubmit(engagementFormController, 'submit');

}


function showVideoBoost() {
    _gscq.push(["show", 399111]);
}

function actionVideoBoost() {
    jQuery('.boost-panel .toggle').removeClass("fa-toggle-off").addClass("fa-toggle-on");
    addBoost(true);
}


function addBoost(_r) {
    if (_r) {
        if (jQuery('#groupBoostAmountSuggestion button[value="other"]').hasClass('selected')) {
            jQuery('#groupBoostAmount').removeClass('hide');
        } else {
            jQuery('#groupBoostAmountSuggestion').removeClass('hide')
        }
    } else {
        jQuery('#groupBoostAmountSuggestion').addClass('hide');
        jQuery('#groupBoostAmount').addClass('hide')
    }
}


if (window.addEventListener) {
    window.addEventListener("message", onMessage, false);
} else if (window.attachEvent) {
    window.attachEvent("onmessage", onMessage, false);
}


function wantNewsletter(_r) {
    engagementFormStore.subscribeNewsletter = _r;
    engagementFormSync();
}

function acceptDebitCGU(_r) {
    engagementFormStore.iban_accept_cgu = _r;
    engagementFormSync();
}

function sendEmailToUser(_r) {
    engagementFormStore.sendEmailToUser = _r;
    engagementFormSync();
}

function wantMagazine(_r) {
    modifyAddress(_r);
    engagementFormStore.subscribeMagazine = _r;

    //engagementFormSubmit(engagementFormController, 'setMagazine');
    if (_r && !engagementFormStore.magazine_country) {
        jQuery("#magazine_country").val(engagementFormStore.country);
        OnChangeMagazineCountry(engagementFormStore.country);
    }
    engagementFormSync();
    jQuery('#wantMagazine').val(_r);

}

function setGender(_r) {
    engagementFormStore.gender = _r;
    engagementFormSync();
}

function selectDebit() {
    jQuery('#MeanButton30').trigger("click");
}

function selectLevy() {
    jQuery('#MeanButton1').trigger("click");
}

function modifyAddress(_r) {
    (_r) ? jQuery('#addressPanel').removeClass("hide") : jQuery('#addressPanel').addClass("hide");
    //(_r) ? jQuery('#groupMagazineAddressValid').addClass("hide") : jQuery('#groupMagazineAddressValid').removeClass("hide");
}

function showCurrency() {
    jQuery('#groupAmountSuggestion .has-dropdown').addClass("open");
}

function validateAddress(_r) {
    (_r) ? jQuery('#groupMagazineAddressValid').removeClass("hide") : jQuery('#groupMagazineAddressValid').addClass("hide");
    (_r) ? jQuery('#addressPanel').addClass("hide") : jQuery('#addressPanel').removeClass("hide");
}

function removeAllEngagementErrors() {
    jQuery(".has-error").removeClass('has-error');

}

dorcas.responders.showEngagementErrors = function (response) {
    removeAllEngagementErrors();
    var errors = response.data.errors;
    for (var erroridx in errors) {
        if (errors.hasOwnProperty(erroridx)) {
            var group = jQuery("[name='" + errors[erroridx] + "'],[data-name='" + errors[erroridx] + "']").closest('.form-group');
            group.addClass('has-error');
            if (errors[erroridx] === 'userEmail' && engagementFormStore.userEmail === '') {
                group.find(".error-message").addClass('hide');
            }

        }
    }
    jQuery('#validateBtn').removeClass("inactive");
    jQuery('#validateLoader').addClass("hide");

    jQuery(".error-container").removeClass('hide');
    //jQuery("html, body").animate({scrollTop: 0}, "slow");
    jQuery("#campaignProposal").addClass('hide');
    Swal.fire({
        title: '<strong>Le formulaire contient des erreurs</strong>',
        timer: 5000,
        animation: "pulse",
        type: 'warning',
        html: 'Veuillez vérifier les champs et valider à nouveau le formulaire.',
        showCloseButton: false,
        customClass: {
            container: 'container-class',
            popup: 'popup-class',
            header: 'header-class',
            title: 'title-class',
            closeButton: 'close-button-class',
            image: 'image-class',
            content: 'content-class',
            input: 'input-class',
            actions: 'actions-class',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class',
            footer: 'footer-class'
        },
        focusConfirm: false,
        confirmButtonText: 'Je vérifie',
        confirmButtonAriaLabel: "Ok",
    }).then(function (result) {
        if (result.value) {
            jQuery("html, body").animate({scrollTop: 0}, "slow");
        }
    });
};

//});

function onMessage(event) {
    // Check sender origin to be trusted
    if (!event.origin.match(/.*emci.*/)) return;

    if (typeof event.data !== 'undefined') {
        if (typeof event.data.kind !== 'undefined') {
            if (event.data.kind === 'connect') {
                engagementFormStore.userToken = event.data.skey;
                engagementFormSubmit(engagementFormController, 'setUserToken');
            }
            if (event.data.kind === 'redirect') {
                document.location = event.data.url;
            }
        }
    }

}

var engagementFormId = '';

function engagementUpdateOneField(form, name, value) {
    var input = jQuery("[name=" + name + "]", form);
    input.val(value);
    if (value !== '') {
        $(input).siblings("label").addClass('completion');
    } else {
        $(input).siblings("label:not('.label-country')").removeClass('completion');
    }

    //input.change();
}

function engagementUpdateFields(form, data) {
    $("input,select,textarea", form).each(function (k, input) {
        if (typeof data[$(input).attr("name")] !== 'undefined') {
            var val = data[$(input).attr("name")];

            engagementUpdateOneField(form, $(input).attr("name"), val);
        }
    });
}


function engagementUpdateData(form, data) {
    engagementShowMeanButtons(data.country);
    engagementUpdateFields(form, data);

    updateEngagementAmount(data.amount);

    updateRadio('radioGender', data.gender);

    //updateRadio('radioOrganization', data.isOrganization ? 1 : 0);
    updateCheckbox('checkOrganization', data.isOrganization);

    showOrganization(data.isOrganization);

    //Gérer dans updateProject
    //updateRadio('radioPartner', data.isPartner ? 1 : 0);
    //showPartner(data.isPartner);

    updateCheckbox('checkMagazine', data.subscribeMagazine);
    modifyAddress(data.subscribeMagazine);
    updateCheckbox('checkNewsletter', data.subscribeNewsletter);

    engagementUpdateCurrencyLabel(data.currency);

}


function updateEngagementAmount(amount) {
    if (amount) {
        var btn = jQuery('.suggested-amount-button[value="' + amount + '"]');
        if (btn.length) {
            btn.trigger('click');
        } else {
            showOtherAmountField(jQuery('.suggested-amount-button[value="other"]'));

        }
    }
}

function engagementFormInit(formId, controller, initData) {

    var syncJobId = 0;
    var form = jQuery('#' + formId);

    engagementFormId = formId;

    function syncData() {
        if (syncJobId) clearTimeout(syncJobId);
        syncJobId = setTimeout(function () {
            engagementCollectData(form);
            engagementFormSync();
            syncJobId = 0;
        }, 500);
    }


    jQuery(form).on('input, change', 'input, textarea', syncData);
    jQuery(form).on('change', 'select:not(#country):not(#dayOfMonth)', syncData);

    form.on("change", "#country", function (_e) {
        var code = $(this).val();

        OnChangeCountry(code);
    });
    form.on("change", "#magazine_country", function (_e) {
        var code = $(this).val();

        OnChangeMagazineCountry(code);
    });
    form.on("keyup", "#account_iban", function (_e) {
        jQuery("#account_iban").closest('.form-group').removeClass('has-error').removeClass('has-success');
    });
    form.on("change", "#account_iban", function (_e) {
        checkIBAN();
    });
    form.on("change", "#account_institution,#account_transit,#account_number", function (_e) {
        console.log("change dpa....");
        checkDPAInstitution();
    });
    form.on("change", "#dayOfMonth", function (_e) {
        engagementFormSetValue('dayOfMonth', $(this).val());
        OnChangeDayOfMonth();
        engagementFormSync();
        //engagementFormSubmit(engagementFormController, 'setDayOfMonth');
    });
    form.on("change", "#userFirstName", function (_e) {
        engagementFormSetValue('userFirstName', $(this).val());

        var eltToUpdate = ["#holder_first_name"];
        syncElements(eltToUpdate, $(this).val());
    });
    form.on("change", "#userLastName", function (_e) {
        engagementFormSetValue('userLastName', $(this).val());

        var eltToUpdate = ["#holder_last_name"];
        syncElements(eltToUpdate, $(this).val());
    });
    form.on("blur", "#userEmail", function (_e) {
        OnChangeUserEmail($(this).val());
    });
    form.on("change", "#userEmailConfirm", function (_e) {
        new_email = jQuery.trim($(this).val()).toLowerCase();
        jQuery('#userEmailConfirm').val(new_email);

        engagementFormSetValue('userEmailConfirm', new_email);
        OnChangeUserEmailConfirm(new_email);
    });

    form.on("change", "#contributionAmount", function (_e) {
        var amount = $(this).val();
        engagementFormSetValue('amount', amount);
        OnAmountChange(amount);
    });

    engagementFormController = controller;

    var qs = getAllUrlParams();

    if (typeof (Storage) !== 'undefined') {
        if (typeof qs.reset == 'undefined' && typeof sessionStorage.engagementFormData !== 'undefined') {
            engagementFormStore = JSON.parse(sessionStorage.engagementFormData);
        } else {
            engagementFormStore = initData;
            engagementFormSetValue('email_check_status', 2); // reset email value for old transaction having xxx==null
            engagementFormSetValue('email_dns_status', 1); // reset email value for old transaction having xxx==null
        }
    }


    if (typeof qs.campaign !== 'undefined' && qs.campaign !== '') {
        if (qs.campaign) {
            if (typeof projects[qs.campaign] === 'undefined') {
                document.location = '/don/';
                return;
            }

            engagementFormStore.isCampaign = true;
            engagementFormStore.project_id = qs.campaign;
            engagementFormStore.isPartner = 0;
        }
    } else {
        engagementFormStore.isCampaign = initData.isCampaign;
        engagementFormStore.project_id = initData.project_id;
    }


    if (typeof qs.sg !== 'undefined' && qs.sg !== '') {
        updateSupportInformation(engagementFormStore.noCorrectMean);
        if (engagementFormStore.noCorrectMean == true) engagementFormStore.amount = "";
        engagementFormStore.noCorrectMean = false;
    }

    engagementFormStore.quickLiveMode = false;
    if (typeof qs.live !== 'undefined' && qs.live !== '') {
        if (qs.live == 1) {
            engagementFormSetValue('quickLiveMode', true);
        }
    }
    updateProject(engagementFormStore.project_id);

    if (engagementFormStore.isCampaign) {
        jQuery("#campaignProject").removeClass('hide');
        updateVariables('project', projects[engagementFormStore.project_id]);
        updateAmounts(projects[engagementFormStore.project_id].suggestedAmounts[engagementFormStore.currency], engagementFormStore.currency);
    } else {
        var urlCampaignPage = jQuery("#urlCampaignPage").val();
        var alerted = sessionStorage.getItem('cancel5000') || '';

        /*
        if (alerted !== 'yes') {

            Swal.fire({
                title: '<strong>S\'agit-il d\'un don pour la campagne des&nbsp;<u>5000&nbsp;SEMEURS</u>&nbsp;?</strong>',
                type: 'question',
                html: '<p>Notre objectif est de réunir 5000&nbsp;SEMEURS qui ont à coeur de faire un don de 1&nbsp;000&nbsp;€&nbsp;ou&nbsp;plus pour ' +
                    'nvivre une grande moisson à travers les projets du centre EMCI.<br>' +
                    '<a href="' + urlCampaignPage + '" style="text-decoration: underline">En savoir plus</a>',

                showCloseButton: true,
                showCancelButton: true,
                customClass: {
                    container: 'container-class',
                    popup: 'popup-class',
                    header: 'header-class',
                    title: 'title-class',
                    closeButton: 'close-button-class',
                    image: 'image-class',
                    content: 'content-class',
                    input: 'input-class',
                    actions: 'actions-class',
                    confirmButton: 'confirm-button-class',
                    cancelButton: 'cancel-button-class',
                    footer: 'footer-class'
                },
                focusConfirm: false,
                confirmButtonText: '<i class="fa fa-thumbs-up"></i> Oui, je veux faire partie des 5000 semeurs',
                confirmButtonAriaLabel: "Oui, je veux faire partie des 5000 semeurs",
                cancelButtonText: 'Non, je préfère faire un don général',
                cancelButtonAriaLabel: 'Non, je préfère faire un don général',
            }).then(function (result) {
                if (result.value) {
                    var urlRedirect = jQuery("#urlFormCurrentCampaign").val();
                    document.location.href = urlRedirect;
                    return;

                } else if (result.dismiss && result.dismiss === 'cancel') {
                    sessionStorage.setItem('cancel5000', 'yes');
                }
            });
        }
        */

        updateAmounts(defaultAmounts[engagementFormStore.isPartner ? 'unlimited' : 'once'][engagementFormStore.currency], engagementFormStore.currency);

    }

    setMagazineVisibility(engagementFormStore.country);
    if (qs.t !== 'undefined' && qs.t !== '') {
        if (!engagementFormStore.holder_last_name) {
            engagementFormStore.holder_last_name = engagementFormStore.userLastName;
        }
        if (!engagementFormStore.holder_first_name) {
            engagementFormStore.holder_first_name = engagementFormStore.userFirstName;
        }
        if (!engagementFormStore.holder_country) {
            engagementFormStore.holder_country = engagementFormStore.country;
        }
        if (!engagementFormStore.holder_address) {
            engagementFormStore.holder_address = engagementFormStore.magazine_address;
        }
        if (!engagementFormStore.holder_city) {
            engagementFormStore.holder_city = engagementFormStore.magazine_city;
        }
        if (!engagementFormStore.holder_postal_code) {
            engagementFormStore.holder_postal_code = engagementFormStore.magazine_postal_code;
        }
        if (!engagementFormStore.holder_province) {
            engagementFormStore.holder_province = engagementFormStore.magazine_province;
        }
    }


    OnAmountChange(engagementFormStore.amount);
    OnChangeMagazineCountry(engagementFormStore.magazine_country);
    engagementUpdateData(form, engagementFormStore);

    needAlertCHF = isSwissCHF();
    showRecurData();

    loadAfrica();
    engagementFormSetValue('init', true);
    sessionStorage.engagementFormData = JSON.stringify(engagementFormStore);
}

function loadAfrica() {
    if (jQuery("#MeanButton999").length) {
        jQuery("#africaInfo").removeClass('hide');
    } else {
        jQuery("#africaInfo").addClass('hide');
    }
}

function giveAfrica() {
    //document.location.href += "#continue";
    jQuery("#MeanButton999").click();
    jQuery('html, body').animate({
        scrollTop: (jQuery('#partnership-mode').offset().top - 50)
    }, 500);
}

function updateVariables(namespace, data) {
    $("[data-" + namespace + "]").each(function () {
        var holder = jQuery(this);
        holder.html(data[holder.data(namespace)]);
    });
}


function createAmountButton(amount, currency) {
    var template = jQuery("#templateAmountButton").text();
    template = template.replace(/%currencyLabel%/g, currencyDisplayLabels[currency]);
    template = template.replace(/%amount%/g, amount);
    return template;
}

function updateAmounts(amounts, currency) {
    var otherButton = jQuery(".suggested-amount-button[value=other]");
    otherButton.parent().find(".suggested-amount-button[value!=other]").remove();
    for (var k in amounts) {
        if (amounts.hasOwnProperty(k)) {
            var btn = jQuery(createAmountButton(amounts[k], currency));
            if (!engagementFormStore.isPartner) btn.find(".partnership").addClass('hide');
            btn.insertBefore(otherButton);
        }
    }

    if (engagementFormStore.isPartner) {
        $("#giveMoreLink").addClass('hide');
        engagementFormStore.nb_recur = 0;
        showRecurData();
    } else {
        $("#giveMoreLink").removeClass('hide');
    }
}

function syncElements(elementsToUpdate, newValue) {
    for (var key in elementsToUpdate) {
        var elt = elementsToUpdate[key];
        jQuery(elt).val(newValue);
        jQuery(elt).change();
    }
}


function updateProject(projectId) {

    if (projectId > 0) {
        var project = projects[projectId];

        if (typeof project === "undefined") {
            jQuery("#projectTypeSelector").removeClass('hide');
        } else {
            if (project.enabledTypes.once && project.enabledTypes.unlimited) {
                jQuery("#projectTypeSelector").removeClass('hide');
            } else if (project.enabledTypes.once && !project.enabledTypes.unlimited) {
                jQuery("#projectTypeSelector").addClass('hide');
                engagementFormStore.isPartner = false;
            } else if (!project.enabledTypes.once && project.enabledTypes.unlimited) {
                jQuery("#projectTypeSelector").addClass('hide');
                engagementFormStore.isPartner = true;
            }
        }
    } else {
        jQuery("#projectTypeSelector").removeClass('hide');
    }

    updateRadio('radioPartner', engagementFormStore.isPartner ? 1 : 0);
    showPartner(engagementFormStore.isPartner);
}

function updateSupportInformation(show) {

    if (show) {
        jQuery('#suggestedProjectTitle').html(projects[engagementFormStore.project_id].proj_title);
        jQuery('.no-correct-mean').removeClass('hide');
    } else {
        jQuery('.no-correct-mean').addClass('hide');
    }

}

function createMeanButtonNone() {
    var template = jQuery("#templateMeanButton").text();
    template = template.replace(/%meanId%/g, '999');
    template = template.replace(/%modeId%/g, '999');
    template = template.replace(/%meanLabel%/g, 'Aucun de ces modes ne me convient');
    template = template.replace(/%meanIcon%/g, '<i class="fa-fw fas fa-search emci-icon"></i>');
    return template;
}

function createMeanButton(mean) {
    var template = jQuery("#templateMeanButton").text();
    template = template.replace(/%meanId%/g, mean.id);
    template = template.replace(/%modeId%/g, mean.mode);
    template = template.replace(/%meanLabel%/g, mean.label);
    template = template.replace(/%meanIcon%/g, mean.icon);
    return template;
}

function engagementShowMeanButtons(country) {
    if (!country) country = 'CA';
    var area = donationData.countries[country].area;
    var means = donationData.means[engagementFormStore.isPartner || engagementFormStore.nb_recur ? 'unlimited' : 'once'][area];
    var container = jQuery("#meanPaymentList");
    container.html('');

    jQuery('#validateBtn').addClass('inactive');
    for (var k in means) {
        if (means.hasOwnProperty(k)) {
            var btn = jQuery(createMeanButton(donationData.means.all[means[k].id]));
            if (engagementFormStore.meanPayment == means[k].id) {
                btn.addClass('selected');
                engagementShowMeanDetails(means[k].id);
                jQuery('#validateBtn').removeClass('inactive');
            }
            container.append(btn);

            /* ------------ HACK FOR TELEPHONE ------------ */
            if (btn.data("mode-id") == 18) {
                if (btn.find(".content-button:contains('Orange Money')").length) {
                    if (jQuery.inArray(country, ['CI', 'SN']) == -1) {/* Keep only Cote d'Ivoire et Sénégal */
                        btn.addClass('hide');
                    }
                } else if (btn.find(".content-button:contains('MTN Money')").length) {
                    if (jQuery.inArray(country, ['BJ', 'CI', 'CG', 'CM']) == -1) {/* Keep only Burundi, Côte d'Ivoire, Congo, Cameroun */
                        btn.addClass('hide');
                    }
                } else if (btn.find(".content-button:contains('Airtel Money')").length) { /* Keep only Gabon */
                    if (jQuery.inArray(country, ['GA']) == -1) {
                        btn.addClass('hide');
                    }
                } else if (btn.find(".content-button:contains('Moov Africa')").length) { /* Keep only Gabon */
                    if (jQuery.inArray(country, ['GA']) == -1) {
                        btn.addClass('hide');
                    }
                }
            }
            /* ------------ END HACK ------------ */

        }
    }

    if (engagementFormStore.isCampaign && engagementFormStore.project_id == 16 && countriesSuggestOnetimeDonation.indexOf(country) !== -1) {
        var btn = jQuery(createMeanButtonNone());
        if (engagementFormStore.meanPayment == 999) {
            btn.addClass('selected');
            engagementShowMeanDetails(999);
            jQuery('#validateBtn').removeClass('inactive');
        }
        container.append(btn);
    }
}


function OnChangeCountry(country) {

    var eltToUpdate = ["#holder_country", "#magazine_country"];
    syncElements(eltToUpdate, country);

    engagementFormSetValue('country', country);
    if (engagementFormStore.currency !== countries[country].currency) {
        engagementChangeCurrency(countries[country].currency);
        if (engagementFormStore.isCampaign) {
            updateAmounts(projects[engagementFormStore.project_id].suggestedAmounts[engagementFormStore.currency], engagementFormStore.currency);
        } else {
            updateAmounts(defaultAmounts[engagementFormStore.isPartner ? 'unlimited' : 'once'][engagementFormStore.currency], engagementFormStore.currency);
        }
    }


    engagementFormSetValue('meanPayment', 0);
    engagementShowMeanButtons(country);
    engagementHideMeanDetails();

    setMagazineVisibility(country);

    engagementFormSync();

    loadAfrica();

    jQuery('#validateBtn').addClass('inactive');

    //engagementFormSubmit(engagementFormController, 'setCountry');
    if (engagementFormStore.nb_recur) {
        jQuery("#giveMoreLink").addClass('hide');
    }

}

function OnChangeMagazineCountry(country) {
    if (country === 'CA' || country === 'US') {
        $("#groupProvince").removeClass('hide');
    } else {
        $("#groupProvince").addClass('hide');
        $("#magazine_province").val('');
    }
}

function OnChangeDayOfMonth() {

    var mean = donationData.means.all[engagementFormStore.meanPayment];
    updateDateBirthPaymentInfo(mean);

}


function SetUserEmail(email) {
    $("[name='userEmail").val(email);
    $("#groupEmail .control-label").addClass("completion");
    OnChangeUserEmail($("[name='userEmail").val());
}


function OnChangeUserEmailConfirm(confirmEmail) {
    var mainEmail = jQuery('#userEmail').val();
    if (confirmEmail != "" && mainEmail != confirmEmail) {
        jQuery("#groupEmailConfirm .form-group").addClass('has-error');
    } else if (confirmEmail == "" || mainEmail == confirmEmail) {
        jQuery("#groupEmailConfirm .form-group").removeClass('has-error');
    }
}

function OnChangeUserEmail(new_email) {

    jQuery("#groupEmail .form-group").removeClass('has-error');

    if (new_email == "") {
        return;
    }

    //on trim les espaces en début et fin et on update le champ
    //et pas besoin d'informer le partenaire...
    new_email = jQuery.trim(new_email).toLowerCase();
    jQuery('#userEmail').val(new_email);

    //clean du emailconfirm
    OnChangeUserEmailConfirm(jQuery("#userEmailConfirm").val());

    //on reset la value dans storage de userEmail
    engagementFormSetValue('userEmail', '');

    //on lance les checks...
    checkEmail(new_email);
    //Xavier - ne pas utiliser pour le moment - checkEmailMX(new_email);
    checkEmailTypo();
}

function checkEmail(new_email) {
    engagementFormSetValue('email_check_status', 2);
    dorcas.ajax(engagementFormController + ":checkEmail", {
        type: 'POST',
        cache: false,
        data: JSON.stringify({email: new_email}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).done(function (response) {
        //console.log("checkEmail : " + response.data.message);
        jQuery("#groupEmail .error-suggestion").addClass("hide");
        engagementFormSetValue('email_check_status', response.data.is_valid);
        if (!response.data.is_valid) {
            jQuery("#groupEmail .form-group").addClass('has-error');
            jQuery("#groupEmail .error-message").removeClass('hide');
        } else {
            //jQuery("#groupEmail .form-group").removeClass('has-error');
        }

    });
}

function checkEmailMX(new_email) {
    engagementFormSetValue('email_dns_status', 2);
    dorcas.ajax(engagementFormController + ":checkEmailMX", {
        type: 'POST',
        cache: false,
        data: JSON.stringify({email: new_email}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).done(function (response) {
        //console.log("checkEmailMX : " + response.data.message);

        jQuery("#groupEmail .error-suggestion").addClass("hide");
        engagementFormSetValue('email_dns_status', response.data.is_valid);
        if (!response.data.is_valid) {
            jQuery("#groupEmail .form-group").addClass('has-error');
            jQuery("#groupEmail .error-message").removeClass('hide');
        }

    });
}

function checkEmailTypo() {
    jQuery('#userEmail').mailcheck({
        suggested: function (element, suggestion) {
            var suggestedEmail = suggestion.full;
            if (suggestion.domain == "gmail.fr") {
                suggestedEmail = suggestion.address + "@gmail.com"
            }
            suggestedEmail = decodeURIComponent(suggestedEmail);
            suggestedEmail = suggestedEmail.replace(/ /g, '');
            jQuery('#email-suggestion-message').removeClass('hide');
            jQuery('#email-suggestion').html(suggestedEmail);
        },
        empty: function (element) {
            jQuery('#email-suggestion-message').addClass('hide');
        }
    });
}

jQuery('#email-suggestion').on('click', function () {
    var newEmail = jQuery(this).html();
    jQuery('#email-suggestion-message').addClass('hide');
    jQuery("#groupEmail .form-group").removeClass('has-error');
    jQuery('#email-suggestion').html('');
    jQuery('#userEmail').val(newEmail);
    jQuery('#userEmail').focus();
});


function updateDateBirthPaymentInfo(mean) {

    if (mean && (engagementFormStore.isPartner || engagementFormStore.nb_recur)) {
        //calcul de la date d'anniversaire
        var dayOfMonth = jQuery("#dayOfMonth").val();

        var dateBirthPayment = calculDateBirthPayment(mean.mode, dayOfMonth);


        var nbDays = dateBirthPayment.diffDays;
        var dayLabel = (dateBirthPayment.diffDays > 1) ? 'dans ' + nbDays + ' jours' : 'dans 1 jour';
        if (dateBirthPayment.diffDays == 0) dayLabel = "aujourd'hui";

        jQuery(".dayofmonth").html(dayOfMonth);
        jQuery(".dayofmonth_offset").html(parseInt(dayOfMonth) + 5);
        jQuery(".daylabel").html(dayLabel);
        jQuery(".birthdaydate").html(dateBirthPayment.dateBirth);

        jQuery(".date-next-payment").removeClass("hide");
    } else {
        jQuery(".date-next-payment").addClass("hide");
    }

}

function createMeanDetailsBox(mean) {

    var mode = donationData.modes[mean.mode];
    var partner = donationData.partners[mean.partner];
    if (mode.code == 'DEBITAUTO' && engagementFormStore.country == 'US') {
        var template = jQuery("#modePayment" + mode.code + 'US').text();
    } else {
        var template = jQuery("#modePayment" + mode.code).text();
    }
    template = template.replace(/%country%/g, countries[engagementFormStore.country].name);
    template = template.replace(/%amount%/g, engagementFormStore.amount);
    template = template.replace(/%currency%/g, engagementFormStore.currency);
    template = template.replace(/%partnerName%/g, partner.name);
    template = template.replace(/%partnerCountry%/g, partner.country);

    var box = jQuery(template);
    if (engagementFormStore.isPartner) {
        box.find('.partnership').removeClass('hide');
    } else {
        box.find('.once').removeClass('hide');
    }
    /*
     var specificFunction = "modeSpecific" + mode.code;
     if (typeof window[specificFunction] === 'function') {
     window[specificFunction](box, mean);
     }*/
    return box;
}

var engagementDetailsBox = '';

function engagementShowMeanDetailsNone() {

    var template = jQuery("#modePaymentNONE").text();
    var box = jQuery(template);
    if (engagementFormStore.isPartner) {
        box.find('.partnership').removeClass('hide');
    } else {
        box.find('.once').removeClass('hide');
    }
    engagementHideMeanDetails();
    box.appendTo(jQuery("#meanPaymentInfoWrapper"));
    engagementDetailsBox = box;

}

function engagementShowMeanDetails(meanId) {
    if (meanId === 999) {
        engagementShowMeanDetailsNone();
        engagementFormStore.noCorrectMean = true;
    } else {
        var mean = donationData.means.all[meanId];
        var box = createMeanDetailsBox(mean);
        engagementHideMeanDetails();
        box.appendTo(jQuery("#meanPaymentInfoWrapper"));
        engagementDetailsBox = box;
        modeSpecific(meanId);
        engagementFormStore.noCorrectMean = false;
    }
}

function engagementHideMeanDetails() {
    jQuery("#meanPaymentInfoWrapper").html('');
}

function reloadDataFromLocaleStorage() {

    jQuery("#meanPaymentInfoWrapper").find("input").each(function () {
        jQuery(this).val(engagementFormStore[this.name]);
        jQuery(this).change();
    });

}

function modeSpecific(meanId) {
    if (typeof donationData.means.all[meanId] === 'undefined') return;
    var mean = donationData.means.all[meanId];
    var mode = donationData.modes[mean.mode];

    var box = engagementDetailsBox;


    var fName = "modeSpecific" + mode.code;
    var fnparams = [box, mean];
    var fn = window[fName];
    if (typeof fn === "function") fn.apply(null, fnparams);

    reloadDataFromLocaleStorage();

    jQuery("#account_iban").siblings("label").addClass('completion');

}

function modeSpecificVIR(box, mean) {
    if (engagementFormStore.country != 'CI' && countries[engagementFormStore.country].uemoa) {
        box.find("#zoneUEMOA").removeClass('hide');

    } else if (engagementFormStore.country != 'GA' && countries[engagementFormStore.country].cemac) {
        box.find("#zoneCEMAC").removeClass('hide');
    }
    if (!engagementFormStore.holder_first_name) engagementFormStore.holder_first_name = engagementFormStore.userFirstName;
    if (!engagementFormStore.holder_last_name) engagementFormStore.holder_last_name = engagementFormStore.userLastName;
}

var isIbanFilled = false;

function modeSpecificPRLVAUTO(box, mean) {

    updateDateBirthPaymentInfo(mean);

    var country_code = jQuery("#country").val();

    jQuery("#account_iban").inputmask(ibanMasks[country_code]);

    var eltToUpdate = ["#holder_country"];
    syncElements(eltToUpdate, engagementFormStore.country);

    if (!engagementFormStore.holder_first_name) engagementFormStore.holder_first_name = engagementFormStore.userFirstName;
    if (!engagementFormStore.holder_last_name) engagementFormStore.holder_last_name = engagementFormStore.userLastName;
    if (!engagementFormStore.holder_address) engagementFormStore.holder_address = engagementFormStore.magazine_address;
    if (!engagementFormStore.holder_postal_code) engagementFormStore.holder_postal_code = engagementFormStore.magazine_postal_code;
    if (!engagementFormStore.holder_city) engagementFormStore.holder_city = engagementFormStore.magazine_city;

}

function modeSpecificCB(box, mean) {
    updateDateBirthPaymentInfo(mean);


    jQuery("#originAmount", box).text(engagementFormStore.amount);

    if (engagementFormStore.currency === 'FCFA') {
        var converted = Math.round(engagementFormStore.amount / 655.957);
        jQuery("#convertFCFA", box).removeClass('hide');
        jQuery("#convertedAmount", box).text(converted);
    } else {
        jQuery("#convertFCFA", box).addClass('hide');
    }
}

function modeSpecificCBCE(box, mean) {
    updateDateBirthPaymentInfo(mean);

}

function modeSpecificDEBITAUTO(box, mean) {
    updateDateBirthPaymentInfo(mean);

    if (!engagementFormStore.holder_first_name) engagementFormStore.holder_first_name = engagementFormStore.userFirstName;
    if (!engagementFormStore.holder_last_name) engagementFormStore.holder_last_name = engagementFormStore.userLastName;
    if (!engagementFormStore.holder_address) engagementFormStore.holder_address = engagementFormStore.magazine_address;
    if (!engagementFormStore.holder_postal_code) engagementFormStore.holder_postal_code = engagementFormStore.magazine_postal_code;
    if (!engagementFormStore.holder_city) engagementFormStore.holder_city = engagementFormStore.magazine_city;
    if (!engagementFormStore.holder_province) engagementFormStore.holder_province = engagementFormStore.magazine_province;


    /*
        jQuery("#originAmount", box).text(engagementFormStore.amount);

        if (engagementFormStore.currency !== 'CAD') {
            var converted = Math.round(engagementFormStore.amount / 655.957);
            jQuery("#convertCAD", box).removeClass('hide');
            jQuery("#convertedAmount", box).text(converted);
        } else {
            jQuery("#convertCAD", box).addClass('hide');
        }

     */
}

function modeSpecificESP(box, mean) {
    if (engagementFormStore.country != 'CI' && countries[engagementFormStore.country].uemoa) {
        box.find("#zoneUEMOA").removeClass('hide');

    } else if (engagementFormStore.country != 'GA' && countries[engagementFormStore.country].cemac) {
        box.find("#zoneCEMAC").removeClass('hide');
    }
}

function modeSpecificCHQ(box, mean) {
    if (engagementFormStore.check_holder == '') {
        engagementFormStore.check_holder = engagementFormStore.userFirstName + ' ' + engagementFormStore.userLastName;
    }
    engagementUpdateOneField(box, 'check_holder', engagementFormStore.check_holder);
}

function modeSpecificTEL(box, mean) {
    var input = document.querySelector("#holder_phone");
    window.holder_phone_input = window.intlTelInput(input, {
        autoPlaceholder: 'none',
        autoHideDialCode: false,
        separateDialCode: true,
        nationalMode: false,
        initialCountry: engagementFormStore.country,
        utilsScript: "/lib/jquery/plugins/intl-tel-input/build/js/utils.js?<%= time %>" // just for formatting/placeholders etc
    });

    jQuery('input[name="holder_phone"]').keyup(function () {
        engagementFormStore.validatedHolderPhone = holder_phone_input.getNumber();
    });
    engagementFormStore.holder_phone = engagementFormStore.userPhone;
    engagementFormStore.validatedHolderPhone = engagementFormStore.validatedPhone;
}

function checkDPAInstitution() {
    var DPAInstitutionInput = jQuery("#account_institution");
    var DPATransitInput = jQuery("#account_transit");
    var DPANumberInput = jQuery("#account_number");
    var DPACountryInput = jQuery("#country");

    var DPACountry = DPACountryInput.val();
    var DPAInstitution = '';
    if (DPACountry === 'CA') {
        DPAInstitution = DPAInstitutionInput.val();
    }
    var DPATransit = DPATransitInput.val();
    var DPANumber = DPANumberInput.val();


    engagementFormSetValue('dpa_check_status', 2);

    if ((DPACountry === 'CA' && DPAInstitution.length != 0 || DPACountry === 'US') && DPATransit.length != 0 && DPANumber.length != 0) {

        dorcas.ajax(engagementFormController + ":checkDPAInstitution", {
            type: 'POST',
            cache: false,
            data: JSON.stringify({
                country: DPACountry,
                account_institution: DPAInstitution,
                account_transit: DPATransit,
                account_number: DPANumber
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        }).done(function (response) {
            console.log(response);
            if (response.data.is_valid == 0) {
                DPAInstitutionInput.closest('.form-group').addClass('has-error');
                DPATransitInput.closest('.form-group').addClass('has-error');
                DPANumberInput.closest('.form-group').addClass('has-error');

                engagementFormSetValue('account_bank_name', '');
                jQuery('#account_bank_name').val('');

                engagementFormSetValue('dpa_check_status', 1);
            } else {
                DPAInstitutionInput.closest('.form-group').removeClass('has-error');
                DPATransitInput.closest('.form-group').removeClass('has-error');
                DPANumberInput.closest('.form-group').removeClass('has-error');

                engagementFormSetValue('account_bank_name', response.data.account_bank_name);
                jQuery('#account_bank_name').val(response.data.account_bank_name);
                if (response.data.updateAddress == 1) {
                    jQuery("#holder_address").val(response.data.address.street);
                    jQuery("#holder_postal_code").val(response.data.address.postal_code);
                    jQuery("#holder_city").val(response.data.address.city);
                    jQuery("#holder_province").val(response.data.address.province);

                    jQuery("#holder_address ~ label").addClass("completion");
                    jQuery("#holder_postal_code ~ label").addClass("completion");
                    jQuery("#holder_city ~ label").addClass("completion");
                    jQuery("#holder_province ~ label").addClass("completion");
                    engagementFormSync();
                }

                engagementFormSetValue('dpa_check_status', 0);
            }
        });
    } else {
        DPAInstitutionInput.closest('.form-group').removeClass('has-error');
        DPATransitInput.closest('.form-group').removeClass('has-error');
        DPANumberInput.closest('.form-group').removeClass('has-error');
        jQuery('#account_bank_name').val('');

        engagementFormSetValue('dpa_check_status', 1);
    }
}

function checkIBAN() {

    var ibanInput = jQuery("#account_iban");
    ibanOk = IBAN.isValid(ibanInput.val());
    var ibanForm = ibanInput.closest('.form-group');

    if (ibanOk) {

        engagementFormSetValue('iban_is_valid', 2);

        dorcas.ajax(engagementFormController + ":checkIBAN", {
            type: 'POST',
            cache: false,
            data: JSON.stringify({iban: ibanInput.val()}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
        }).done(function (response) {

            engagementFormSetValue('iban_is_valid', response.data.is_valid);
            if (!response.data.is_valid) {
                ibanForm.addClass('has-error');
                engagementFormSetValue('account_bank_name', '');
                engagementFormSetValue('account_swift', '');

            } else {
                ibanForm.removeClass('has-error');
                engagementFormSetValue('account_bank_name', response.data.account_bank_name);
                engagementFormSetValue('account_swift', response.data.account_swift);

                if (response.data.updateAddress == 1) {
                    jQuery("#holder_address").val(response.data.address.street);
                    jQuery("#holder_postal_code").val(response.data.address.postal_code);
                    jQuery("#holder_city").val(response.data.address.city);
                    jQuery("#holder_province").val(response.data.address.province);

                    jQuery("#holder_address ~ label").addClass("completion");
                    jQuery("#holder_postal_code ~ label").addClass("completion");
                    jQuery("#holder_city ~ label").addClass("completion");
                    jQuery("#holder_province ~ label").addClass("completion");
                    engagementFormSync();
                }

            }
        });
    } else {
        engagementFormSetValue('iban_is_valid', 0);
    }


    ibanForm
        .removeClass(!ibanOk ? 'has-success' : 'has-error')
        .addClass(ibanOk ? 'has-success' : 'has-error');

    if (ibanOk || jQuery("#account_iban").val().length == 0) {
        ibanForm.find(".error-block").remove();
    }

    if (jQuery("#account_iban").val().length == 0) {
        ibanForm.removeClass('has-error').removeClass('has-success');
    }

    return ibanOk;
}

function setMagazineVisibility(country) {

    if (isInMagazinePostalZone(country)) {
        jQuery('#magazineCheckboxWrapper').removeClass('hide');
    } else {
        jQuery('#magazineCheckboxWrapper').addClass('hide');
    }

}

function isInMagazinePostalZone(country) {
    return (countriesMagazine.indexOf(country) !== -1);
}


var ibanMasks = {
    "AT": "AT**-****-****-****-****",
    "BE": "BE**-****-****-****",
    "BG": "BG**-****-****-****-****-**",
    "CH": "CH**-****-****-****-****-*",
    "CY": "CY**-****-****-****-****-****-****",
    "CZ": "CZ**-****-****-****-****-****",
    "DE": "DE**-****-****-****-****-**",
    "DK": "DK**-****-****-****-**",
    "EE": "EE**-****-****-****-****",
    "ES": "ES**-****-****-****-****-****",
    "FI": "FI**-****-****-****-**",
    "FR": "FR**-****-****-****-****-****-***",
    "GB": "GB**-****-****-****-****-**",
    "GF": "FR**-****-****-****-****-****-***",
    "GP": "FR**-****-****-****-****-****-***",
    "GR": "GR**-****-****-****-****-****-***",
    "HU": "HU**-****-****-****-****-****-****",
    "IE": "IE**-****-****-****-****-**",
    "IS": "IS**-****-****-****-****-****-**",
    "IT": "IT**-****-****-****-****-****-***",
    "LI": "LI**-****-****-****-****-*",
    "LT": "LT**-****-****-****-****",
    "LU": "LU**-****-****-****-****",
    "LV": "LV**-****-****-****-****-*",
    "MC": "MC**-****-****-****-****-****-***",
    "MQ": "FR**-****-****-****-****-****-***",
    "MT": "MT**-****-****-****-****-****-****-***",
    "NL": "NL**-****-****-****-**",
    "NO": "NO**-****-****-***",
    "PL": "PL**-****-****-****-****-****-****",
    "PT": "PT**-****-****-****-****-****-*",
    "RE": "FR**-****-****-****-****-****-***",
    "RO": "RO**-****-****-****-****-****",
    "SE": "SE**-****-****-****-****-****",
    "SI": "SI**-****-****-****-***",
    "SK": "SK**-****-****-****-****-****"
};

var countriesMagazine = ['FR', 'DE', 'GB', 'BE', 'CA', 'DK', 'HR', 'ES', 'EE', 'US',
    'FI', 'GR', 'GD', 'HU', 'IT', 'LV', 'LT', 'LU', 'MT',
    'NO', 'NZ', 'PY', 'NL', 'PL', 'PT', 'RO', 'RU', 'SM',
    'SH', 'LC', 'SK', 'SI', 'SE', 'CH', 'UA', 'GP', 'GF',
    'MQ', 'NC', 'PF', 'RE', 'YT', 'PM', 'MC', 'GY'];

var countriesSuggestOnetimeDonation = [
    'DZ', 'AO', 'BJ', 'BF', 'BI', 'CM', 'CV', 'CF', 'CG', 'CD',
    'CI', 'DJ', 'EG', 'ER', 'ET', 'GA', 'GM', 'GH', 'GI', 'GN',
    'GQ', 'GW', 'HT', 'MU', 'KE', 'LS', 'LB', 'LR', 'MG', 'MW',
    'MV', 'ML', 'MT', 'MA', 'MR', 'YT', 'MZ', 'NA', 'NE', 'NG',
    'UG', 'PS', 'RW', 'EH', 'SL', 'SD', 'SZ', 'SN', 'TZ', 'TD',
    'TG', 'TN'
];


// echeloned
function openGiveMore(controller) {
    dorcas.ajax(controller, {
        method: 'post',
        type: 'POST',
        data: JSON.stringify(engagementFormStore),
        dataType: 'json'
    });
}

function showRecurData() {
    if (engagementFormStore.nb_recur) {
        var template = jQuery("#recurBlockTpl").text();
        template = template.replace(/%currencyLabel%/g, currencyDisplayLabels[engagementFormStore.currency]);
        template = template.replace(/%amount%/g, engagementFormStore.amount);
        template = template.replace(/%nbRecur%/g, engagementFormStore.nb_recur);
        template = template.replace(/%amountMonth%/g, Math.round(engagementFormStore.amount / engagementFormStore.nb_recur));
        jQuery("#recurBlock").html(template);
        jQuery("#giveMoreLink").addClass('hide');
        jQuery("#groupFrequency").removeClass('hide');
    } else {
        jQuery("#recurBlock").html('');
        if (!engagementFormStore.isPartner) {
            jQuery("#giveMoreLink").removeClass('hide');
            jQuery("#groupFrequency").addClass('hide');
        }
    }
}

function cancelGiveMore() {
    engagementFormStore.nb_recur = 0;
    engagementFormStore.dayOfMonth = 0;
    engagementShowMeanButtons(engagementFormStore.country);
    engagementFormSync();
    showRecurData();
}