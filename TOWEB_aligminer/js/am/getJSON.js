// procesa el resultado como objeto Json
function procesaJSON (obj) {

		// parsea el array desde el texto json
		var arrayHashes = obj.responseText.evalJSON(true);
		
		var res='';
		
		// recorre el array
		for ( var i=0, len=arrayHashes.length; i<len; ++i ){
			res = res + "<p>endPos:" + arrayHashes[i].endPos + "</p> ";
		}
		
		// poner resultados en el div
		$('datosDIV').innerHTML=res;
}

function getJSON () {
    // pide el archivo json al servidor
    new Ajax.Request('entropy_above.json', {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: procesaJSON
    });
}
