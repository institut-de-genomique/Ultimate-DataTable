
angular.module('ultimateDataTableServices')
.directive('udtBase64Img', [function () {
	return {
		 restrict: 'A',
		 require: 'ngModel',
		 link: function (scope, elem, attrs, ngModel) {
    		  var nbFiles = 0, counter = 0, files;
			 
    		  var onload =  function (e) {
        		if(e.target.result!= undefined && e.target.result != ""){
    				  var udtBase64Img = {};
    				  udtBase64Img._type = "img";
    				  udtBase64Img.fullname = e.target.file.name;
    				  //console.log("udtBase64Img.fullname "+udtBase64Img.fullname);
    				  //Get the extension
    				  var matchExtension = e.target.file.type.match(/^image\/(.*)/);
        			  if(matchExtension && matchExtension.length > 1){
        				  udtBase64Img.extension = matchExtension[1];
        				  
        				  //Get the base64 without the extension feature
        				  var matchBase64 = e.target.result.match(/^.*,(.*)/);
        				  udtBase64Img.value = matchBase64[1];
        				  //Load image from the base64 to get the width and height
        				  var img = new Image();
        				  img.src =  e.target.result;

        				  img.onload = function(){
        					  counter++;
        					  udtBase64Img.width = img.width;
        					  udtBase64Img.height = img.height;
        					  files.push(udtBase64Img);
        					  onloadend();
        					  
        				  };		        				  
        				  		        				  
    				  }else{
    					 counter++;
    					 alert("This is not an image..."+udtBase64Img.fullname);
    					 elem[0].value = null;
    				  }
        			  
				  }
    		  };
    		  
    		  var onloadend = function(){
    			  if(nbFiles === counter){
    				  if(attrs.multiple){
    					  scope.$apply(function(scope){ngModel.$setViewValue(files);});
    				  }else{
    					  scope.$apply(function(scope){ngModel.$setViewValue(files[0]);});
    				  }
    				  
    			  }
    		  };
    		  
		      elem.on('change', function() {
		    	  nbFiles = 0, counter = 0;
		    	  files = [];
		    	  if(attrs.multiple){
		    		 nbFiles = elem[0].files.length
		    		  angular.forEach(elem[0].files, function(inputFile){
		    			  var reader = new FileReader();
		    			  reader.file = inputFile;
		    			  reader.onload = onload;	
		    			  //reader.onloadend = onloadend;
		    			  reader.readAsDataURL(inputFile);				    			  		        						    			  
		    		  });
		    	  }else{
		    		  var reader = new FileReader();
		    		  nbFiles = elem[0].files.length
		    		  reader.file = elem[0].files[0];
		    		  reader.onload = onload;
		    		  //reader.onloadend = onloadend;
	    			  reader.readAsDataURL(elem[0].files[0]);				    			  		    	 
		    	  }				    	  
		      });
			  elem.on('click', function() {
    			  elem[0].value=null;
    		  });
		 }
		};
		}]).directive('udtBase64File', [function () {
	return {
		 restrict: 'A',
		 require: 'ngModel',
		
		 link: function (scope, elem, attrs, ngModel) {
			 var nbFiles = 0, counter = 0, files;
    		 
    		  var onload = onload = function (e) {
    			 if(e.target.result!= undefined && e.target.result != ""){
					 
					  var udtBase64File = {};
					  udtBase64File.fullname = e.target.file.name;
    				  
    				  //Get the extension
    				  //console.log("File type "+e.target.file.type);
    				  var matchExtension = e.target.file.type.match(/^application\/(.*)/);
    				  var matchExtensionText = e.target.file.type.match(/^text\/(.*)/);
    				  if(matchExtension && matchExtension.length > 1){
    					  udtBase64File.extension = matchExtension[1];
    				  }else if(matchExtensionText && matchExtensionText.length > 1){
    					  udtBase64File.extension = matchExtensionText[1];
    				  }
    				  if(udtBase64File.extension != undefined){
    					  udtBase64File._type = "file";
        				  
        				  //Get the base64 without the extension feature
        				  var matchBase64 = e.target.result.match(/^.*,(.*)/);
        				  udtBase64File.value = matchBase64[1];
        				  files.push(udtBase64File);
    				  }else{
    					 alert("This is not an authorized file : "+udtBase64File.fullname);		        					 
    				  }
    				  counter++;
				  }
    			 
    		  }
    		  var onloadend = function(e){
    			  if(nbFiles === counter){
    				  if(attrs.multiple){
    					  scope.$apply(function(scope){ngModel.$setViewValue(files);});
    				  }else{
    					  scope.$apply(function(scope){ngModel.$setViewValue(files[0]);});
    				  }
    				  
    			  }
    		  };
    		  
    		  elem.on('change', function() {
		    	  nbFiles = 0, counter = 0;
		    	  files = [];
		    	  if(attrs.multiple){
		    		  nbFiles = elem[0].files.length
		    		  angular.forEach(elem[0].files, function(inputFile){
		    			  var reader = new FileReader();
		    			  reader.file = inputFile;
		    			  reader.onload = onload;	
		    			  reader.onloadend = onloadend;
		    			  reader.readAsDataURL(inputFile);				    			  		        						    			  
		    		  });
		    	  }else{
		    		  var reader = new FileReader();
		    		  nbFiles = elem[0].files.length
		    		  reader.file = elem[0].files[0];
		    		  reader.onload = onload;
		    		  reader.onloadend = onloadend;
	    			  reader.readAsDataURL(elem[0].files[0]);				    			  		    	 
		    	  }				    	  
		      });
		      elem.on('click', function() {
    			  elem[0].value=null;
    		  });
		      
		 }
		};
}]);