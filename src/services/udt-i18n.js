angular.module('ultimateDataTableServices').
/* A I18n service, that manage internal translation in udtI18n
* follow the http://tools.ietf.org/html/rfc4646#section-2.2.4 spec
* preferedLanguageVar can be a string or an array of string
* https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage
*/
factory('udtI18n', [function() {
    	var constructor = function(preferedLanguageVar) {
				var udtI18n = {
          init: function() {
            this.preferedLanguage = 'en';
            // If preferedLanguageVar is undefined we keep the defaultLanguage
            if(!preferedLanguageVar) {
              return false;
            }

            var preferedLanguage = [];
            if(!Array.isArray(preferedLanguageVar)) {
              preferedLanguage.push(preferedLanguageVar);
            } else {
              preferedLanguage = preferedLanguageVar.slice();
            }

            preferedLanguage.some(function(language) {
              // We first try to find the entire language string
              // Primary Language Subtag with Extended Language Subtags
              if(this.translationExist(language)) {
                this.preferedLanguage = language;
                return true;
              }

              // Then we try with only Primary Language Subtag
              var splitedLanguages = language.split('-');
              if(splitedLanguages.length > 1) {
                var primaryLanguageSubtag = splitedLanguages[0];
                if(this.translationExist(primaryLanguageSubtag)) {
                  this.preferedLanguage = primaryLanguageSubtag;
                  return true;
                }
              }
            }, this);
          },
          translationExist: function(language) {
            return this.translateTable[language] !== undefined;
          },
				  translateTable : {
						"fr": {
							"result":"R\u00e9sultats",
							"date.format":"dd/MM/yyyy",
							"datetime.format":"dd/MM/yyyy HH:mm:ss",
							"datatable.button.selectall":"Tout S\u00e9lectionner",
							"datatable.button.unselectall" :"Tout D\u00e9lectionner",
							"datatable.button.cancel":"Annuler",
							"datatable.button.hide":"Cacher",
							"datatable.button.show":"Afficher D\u00e9tails",
							"datatable.button.edit":"Editer",
							"datatable.button.sort":"Trier",
							"datatable.button.save":"Sauvegarder",
							"datatable.button.add":"Ajouter",
							"datatable.button.remove":"Supprimer",
							"datatable.button.searchLocal":"Rechercher",
							"datatable.button.resetSearchLocal":"Annuler",
							"datatable.button.length" : "Taille ({0})",
							"datatable.totalNumberRecords" : "{0} R\u00e9sultat(s)",
							"datatable.button.exportCSV" : "Export CSV",
							"datatable.msg.success.save" : "Toutes les sauvegardes ont r\u00e9ussi.",
							"datatable.msg.error.save" : "Il y a {0} sauvegarde(s) en erreur.",
							"datatable.msg.success.remove" : "Toutes les suppressions ont r\u00e9ussi.",
							"datatable.msg.error.remove":" Il y a {0} suppression(s) en erreur.",
							"datatable.remove.confirm" : "Pouvez-vous confirmer la suppression ?",
							"datatable.export.sum" : "(Somme)",
							"datatable.export.average" : "(Moyenne)",
							"datatable.export.unique" :"(Valeur uniq.)",
							"datatable.export.countDistinct" :"(Nb. distinct d'occurence)",
							"datatable.export.yes" : "Oui",
							"datatable.export.no" : "Non",
							"datatable.button.group" : "Grouper / D\u00e9grouper",
							"datatable.button.generalGroup" : "Grouper toute la s\u00e9lection",
							"datatable.button.basicExportCSV" : "Exporter toutes les lignes",
							"datatable.button.groupedExportCSV" : "Exporter les lignes group\u00e9es",
							"datatable.button.showOnlyGroups" : "Voir uniquement les groupes",
							"datatable.button.top" : "Aller au d\u00e9but du tableau"
						},
						"en": {
							"result":"Results",
							"date.format":"MM/dd/yyyy",
							"datetime.format":"MM/dd/yyyy HH:mm:ss",
							"datatable.button.selectall":"Select all",
							"datatable.button.unselectall" :"Deselect all",
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
							"datatable.button.showOnlyGroups" : "See only group",
							"datatable.button.top" : "Go to the top"
						},
						"nl": {
							"result": "Resultaten",
							"date.format": "dd/MM/yyyy",
							"datetime.format": "dd/MM/yyyy HH:mm:ss",
							"datatable.button.selectall": "Selecteer alles",
							"datatable.button.unselectall": "Deselecteer alles",
							"datatable.button.cancel": "Annuleren",
							"datatable.button.hide": "Verberg",
							"datatable.button.show": "Toon details",
							"datatable.button.edit": "Bewerk",
							"datatable.button.sort": "Sorteer",
							"datatable.button.save": "Opslaan",
							"datatable.button.add": "Toevoegen",
							"datatable.button.remove": "Verwijderen",
							"datatable.button.searchLocal": "Zoek",
							"datatable.button.resetSearchLocal": "Annuleer",
							"datatable.button.length": "Grote ({0})",
							"datatable.totalNumberRecords": "{0} Resultaten",
							"datatable.button.exportCSV": "CSV Export",
							"datatable.msg.success.save": "Opslag is succesvol",
							"datatable.msg.error.save": "Er zijn {0} backup(s) met een fout.",
							"datatable.msg.success.remove": "Alles is succesvol verwijderd.",
							"datatable.msg.error.remove": " Er zijn {0} verwijderingen met een fout.",
							"datatable.remove.confirm": "Bevestigd u de verwijdering?",
							"datatable.export.sum": "(Som)",
							"datatable.export.average": "(Gemiddeld)",
							"datatable.export.unique":"(Enkele waarde)",
							"datatable.export.countDistinct": "(Aantal unieke waarden)",
							"datatable.export.yes": "Ja",
							"datatable.export.no": "Nee",
							"datatable.button.group": "Groeperen / Degroeperen",
							"datatable.button.generalGroup": "Groepeer alle geselecteerde regels",
							"datatable.button.basicExportCSV": "Exporteer alle regels",
							"datatable.button.groupedExportCSV": "Exporteer alleen de gegroepeerde regels",
							"datatable.button.showOnlyGroups": "Toon alleen de groep",
							"datatable.button.top" : "Ga naar de top"
						}
					},

					//Translate the key with the correct language
					Messages : function(key) {
						  var translatedString = this.translateTable[this.preferedLanguage][key];
						  if(translatedString === undefined) {
							  return key;
						  }
						  for (var i = 1; i < arguments.length; i++) {
								translatedString = translatedString.replace("{"+(i-1)+"}", arguments[i]);
						  }
						  return translatedString;
					}
				};

        udtI18n.init();
				return udtI18n;
			};
    	return constructor;
}]);
