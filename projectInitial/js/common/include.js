$.extend({
 includePath: '',
 include: function(file,head) {
	 var language= "";
     if (getCookie("userLanguage")) {
	    language = getCookie("userLanguage");
     } else {
	    language = getNavLanguage();
     }
     var shortCode = language.substring(0, 2);
	 var files = typeof file == "string" ? [file]:file;
	 for (var i = 0; i < files.length; i++) {
		 var name = files[i].replace(/^\s|\s$/g, "");
		 var att = name.split('.');
		 var ext = att[att.length - 1].toLowerCase();
		 if(shortCode!='zh'){
			 att[att.length - 2]=att[att.length - 2]+"_"+shortCode;
			 name=att.join("."); 
		 }
		 var isCSS = ext == "css";
		 var tag = isCSS ? "link" : "script";
		 var attr = isCSS ? " type='text/css' rel='stylesheet' " : " language='javascript' type='text/javascript' ";
		 var link = (isCSS ? "href" : "src") + "='" + $.includePath + name + "'";
		 if ($(tag + "[" + link + "]").length == 0){
	       //document.write("<" + tag + attr + link + "></" + tag + ">");
			 if(typeof head != 'undefined'){
				 $(head).prepend("<" + tag + attr + link + "></" + tag + ">");
			 }else{
				 $("head").append("<" + tag + attr + link + "></" + tag + ">");
			 }

		 }
	  }
  }
});