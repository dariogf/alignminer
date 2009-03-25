// Nucleótidos:
// 
//    ORANGE                  A
//    RED                     C
//    BLUE                    T
//    GREEN                   G
// 
// Aminoácidos:
// 
//    ORANGE                  GPST
//    RED                     HKR
//    BLUE                    FWY
//    GREEN                   AILMV
//    YELLOW                  C
//    CYAN                    DE
//    MAGENTA                 NQ
// 


// procesa el resultado como objeto Json
function procesaAlignment (obj) {
        
        coloresAmino = {
            'G': 'class="clOrange"',
            'P': 'class="clOrange"',
            'S': 'class="clOrange"',
            'T': 'class="clOrange"',
            
            'H': 'class="clRed"',
			'K': 'class="clRed"',
			'R': 'class="clRed"',
			
			'F': 'class="clBlue"',
			'W': 'class="clBlue"',
			'Y': 'class="clBlue"',
			
			'A': 'class="clGreen"',
			'I': 'class="clGreen"',
			'L': 'class="clGreen"',
			'M': 'class="clGreen"',
			'V': 'class="clGreen"',
			
			'C': 'class="clYellow"',
			
			'D': 'class="clCyan"',
			'E': 'class="clCyan"',
			
			'N': 'class="clMagenta"',
			'Q': 'class="clMagenta"',
			
		};
    
		// parsea el array desde el texto json
		secuencias = obj.responseText.evalJSON(true);
		
		res = '<div style="width: 50px"><table border="0" cellspacing="0" cellpadding="3">';
	    
		// recorre el array
		for ( var s=0, len=secuencias.length; s<len; s=s+2 ){
			res=res+'<tr align="center">';
			
			res=res+'<td >'+secuencias[s]+'</td>';
			
			for (var i=1; i < secuencias[s+1].length; i++) {
				c = secuencias[s+1].charAt(i);
				color = coloresAmino[c];
				
				res=res+'<td '+color+'>'+c+'</td>';
			};
			
			res=res+'</tr>';
			
			// res = res + "<p> endPos:" + arrayHashes[i] + "</p> ";
		}
		
		res=res+'</table></div>';
		
		// poner resultados en el div
		$('alignmentDIV').innerHTML=res;
}

function showAlignment (star,end,destination,runid) {
    // pide el archivo json al servidor
    new Ajax.Request('tmpdata/'+runid+'/json/alignment.json', {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: procesaAlignment
    });    
    
}

