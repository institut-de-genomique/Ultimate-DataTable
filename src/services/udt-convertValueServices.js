angular.module('ultimateDataTableServices').
factory('udtConvertValueServices', [function() {
    		var constructor = function($scope){
				var udtConvertValueServices = {
				    //Convert the value in inputUnit to outputUnit if the units are different
					convertValue : function(value, inputUnit, outputUnit, precision){
							if(inputUnit !== outputUnit && !isNaN(value) && null !== value){
								var convert = this.getConversion(inputUnit,outputUnit);
								if(convert != undefined && !angular.isFunction(convert)){
									value = value * convert;
									if(precision !== undefined){
										value = value.toPrecision(precision);
									}
								}else if(convert === undefined || convert === null){
									throw "Error: Unknown Conversion "+inputUnit+" to "+outputUnit;
									return undefined;
								}
							}
							
							return value;
					},
					//Get the multiplier to convert the value
					getConversion : function(inputUnit, outputUnit){
						if((inputUnit === '\u00B5g' && outputUnit === 'ng') || (inputUnit === 'ml' && outputUnit === '\u00B5l') || (inputUnit === 'pM' && outputUnit === 'nM')){
							return (1/1000);
						}else if((inputUnit === 'ng' && outputUnit === '\u00B5g') || (inputUnit === '\u00B5l' && outputUnit === 'ml') || (inputUnit === 'nM' && outputUnit === 'pM')){
							return 1000;
						}else if ((inputUnit === 'mM' && outputUnit === 'nM')){
							return 1000000;
						}else if ((inputUnit === 'nM' && outputUnit === 'mM')){
							return 1/1000000;
						}
						return undefined;
					},
					parse : function(value){
						var valueToConvert = value;
						if(!angular.isNumber(valueToConvert)){
							var valueConverted = value.replace(/\s+/g,"").replace(',','.');
							valueConverted = parseFloat(valueConverted);
							
							return valueConverted;
						}
						
						return value;
					}
				};
				return udtConvertValueServices;
			};
    		return constructor;
}]);