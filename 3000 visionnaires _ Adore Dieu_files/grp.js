jQuery(document).ready(function(){
	
	var radio = jQuery(".btn_radio input[name=amount]");
	var input_val_radio = jQuery('.input_montant input[name=intmontant]');
	var input_val_radio_devise = jQuery('.input_montant input[name=montant]');
	var devise = jQuery("select#devise");

	input_val_radio.val(jQuery(".btn_radio input[name=amount]:checked").val());
	input_val_radio_devise.val(input_val_radio.val() + devise.val());

	radio.change(function(){
		console.log(jQuery(this).val());
		if (jQuery(this).is('#r6')) {	
			input_val_radio.focus();		
		}
		input_val_radio.val(jQuery(this).val());
		input_val_radio_devise.val(jQuery(this).val() + devise.val());
		devise.val('EUR');
	});

	input_val_radio.keyup(function(){
		input_val_radio_devise.val(jQuery(this).val() + devise.val());
	});
	
	devise.change(function(){
		console.log(jQuery(this).val());
		input_val_radio_devise.val(input_val_radio.val() + devise.val());
	});

	jQuery("#form_donate").validate({
		rules: {
			intmontant: {
				required : true,
				number: true
			},
			email: {
				required: true,
				email: true
			},
			address: {
				required: "#newsletter_mag_adoredieu:checked"
			},
			cp: {
				required: "#newsletter_mag_adoredieu:checked"
			},
			city: {
				required: "#newsletter_mag_adoredieu:checked"
			},
			titulaire_iban: {
				required: function(element) {
					return jQuery("#f2").val() == "mensuelle" && jQuery("[name=payment]:checked").val() == "pa";
				}
			},
			titulaire_nom: {
				required: function(element) {
					return jQuery("#f2").val() == "mensuelle" && jQuery("[name=payment]:checked").val() == "pa";
				}
			},
			titulaire_prenom: {
				required: function(element) {
					return jQuery("#f2").val() == "mensuelle" && jQuery("[name=payment]:checked").val() == "pa";
				}
			},
			titulaire_adresse: {
				required: function(element) {
					return jQuery("#f2").val() == "mensuelle" && jQuery("[name=payment]:checked").val() == "pa";
				}
			},
			titulaire_cp: {
				required: function(element) {
					return jQuery("#f2").val() == "mensuelle" && jQuery("[name=payment]:checked").val() == "pa";
				}
			},
			titulaire_ville: {
				required: function(element) {
					return jQuery("#f2").val() == "mensuelle" && jQuery("[name=payment]:checked").val() == "pa";
				}
			},
			titulaire_pays: {
				required: function(element) {
					return jQuery("#f2").val() == "mensuelle" && jQuery("[name=payment]:checked").val() == "pa";
				}
			}
		},
		// messages: {
		// 	intmontant: {
		// 		required : 'Vous avez oublié le montant',
		// 		number: 'Cette valeur doit être numérique'
		// 	},
		// 	email: {
		// 		required: 'Champ obligatoire',
		// 		email: 'Veuillez saisir un email valide.'
		// 	}
		// }
	});

})