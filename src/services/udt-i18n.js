angular.module('ultimateDataTableServices').
factory('udtI18n', [function() {
    		var constructor = function(preferedLanguageVar){
				var udtI18n = {
				    preferedLanguage : (preferedLanguageVar !== undefined ? preferedLanguageVar:"en"),
					translateTable : {
						"fr":{
							"result":"Résultats",
							"date.format":"dd/MM/yyyy",
							"datetime.format":"dd/MM/yyyy HH:mm:ss",
							"datatable.button.selectall":"Tout Sélectionner",
							"datatable.button.unselectall" :"Tout Délectionner",
							"datatable.button.cancel":"Annuler",
							"datatable.button.hide":"Cacher",
							"datatable.button.show":"Afficher Détails",
							"datatable.button.edit":"Editer",
							"datatable.button.sort":"Trier",
							"datatable.button.save":"Sauvegarder",
							"datatable.button.add":"Ajouter",
							"datatable.button.remove":"Supprimer",
							"datatable.button.searchLocal":"Rechercher",
							"datatable.button.resetSearchLocal":"Annuler",
							"datatable.button.length" : "Taille ({0})",
							"datatable.totalNumberRecords" : "{0} Résultat(s)",
							"datatable.button.exportCSV" : "Export CSV",
							"datatable.msg.success.save" : "Toutes les sauvegardes ont réussi.",
							"datatable.msg.error.save" : "Il y a {0} sauvegarde(s) en erreur.",
							"datatable.msg.success.remove" : "Toutes les suppressions ont réussi.",
							"datatable.msg.error.remove":" Il y a {0} suppression(s) en erreur.",
							"datatable.remove.confirm" : "Pouvez-vous confirmer la suppression ?",
							"datatable.export.sum" : "(Somme)",
							"datatable.export.average" : "(Moyenne)",
							"datatable.export.unique" :"(Valeur uniq.)",
							"datatable.export.countDistinct" :"(Nb. distinct d'occurence)",
							"datatable.export.yes" : "Oui",
							"datatable.export.no" : "Non",
							"datatable.button.group" : "Grouper / Dégrouper",
							"datatable.button.generalGroup" : "Grouper toute la sélection",
							"datatable.button.basicExportCSV" : "Exporter toutes les lignes",
							"datatable.button.groupedExportCSV" : "Exporter les lignes groupées",
							"datatable.button.showOnlyGroups" : "Voir uniquement les groupes"	
						},
						"en":{
							"result":"Results",
							"date.format":"MM/dd/yyyy",
							"datetime.format":"MM/dd/yyyy HH:mm:ss",
							"datatable.button.selectall":"Tout Sélectionner",
							"datatable.button.unselectall" :"Tout Délectionner",
							"datatable.button.cancel":"Cancel",
							"datatable.button.hide":"Hide",
							"datatable.button.show":"Show Details",
							"datatable.button.edit":"Edit",
							"datatable.button.sort":"Order",
							"datatable.button.save":"Save",
							"datatable.button.add":"Add",
							"datatable.button.remove":"Remove",
							"datatable.button.searchLocal":"Search",
							"datatable.button.resetSearchLocal":"Cancel",
							"datatable.button.length" : "Size ({0})",
							"datatable.totalNumberRecords" : "{0} Result(s)",
							"datatable.button.exportCSV" : "CSV Export",
							"datatable.msg.success.save" : "All backups are successful.",
							"datatable.msg.error.save" : "There are {0} backup(s) in error.",
							"datatable.msg.success.remove" : "All the deletions are successful.",
							"datatable.msg.error.remove":" There are {0} deletion(s) in error.",
							"datatable.remove.confirm" : "Can you confirm the delete ?",
							"datatable.export.sum" : "(Sum)",
							"datatable.export.average" : "(Average)",
							"datatable.export.unique" :"(Single value)",
							"datatable.export.countDistinct" :"(Num. of distinct occurrence)",
							"datatable.export.yes" : "Yes",
							"datatable.export.no" : "No",
							"datatable.button.group" : "Group / Ungroup",
							"datatable.button.generalGroup" : "Group All selected lines",
							"datatable.button.basicExportCSV" : "Export all lines",
							"datatable.button.groupedExportCSV" : "Export only grouped lines",
							"datatable.button.showOnlyGroups" : "See only group"
						}
					},
					
					//Translate the key with the correct language
					Messages : function(key){
						  if(this.translateTable[this.preferedLanguage] === undefined){
							this.preferedLanguage = "en";
						  }
						  
						  var translatedString = this.translateTable[this.preferedLanguage][key];
						  if(translatedString === undefined){
							return key;
						  }
						  for (var i=1; i < arguments.length; i++) {
								translatedString = translatedString.replace("{"+(i-1)+"}", arguments[i]);
						  }
						  return translatedString;
					}
				};
				return udtI18n;
			};
    		return constructor;
}]);