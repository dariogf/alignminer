// Diego Darío Guerrero Fernández
// 
// v0.1 - 20080426 - 
// 
// ================================================

// Clase para gestionar los colores de los alineamientos
var TColors = Class.create({
  
    //----------------------------------
    //Constructor
    //----------------------------------
    initialize: function(sequenceType){
        if (sequenceType == 'dna') {
          this.colors = {
            'A': 'clOrange',
            'C': 'clRed',
            'T': 'clBlue',
            'G': 'clGreen',
          };
            
        }else{
          this.colors = {
              'G': 'clOrange',
              'P': 'clOrange',
              'S': 'clOrange',
              'T': 'clOrange',

              'H': 'clRed',
            	'K': 'clRed',
            	'R': 'clRed',

            	'F': 'clBlue',
            	'W': 'clBlue',
            	'Y': 'clBlue',

            	'A': 'clGreen',
            	'I': 'clGreen',
            	'L': 'clGreen',
            	'M': 'clGreen',
            	'V': 'clGreen',

            	'C': 'clYellow',

            	'D': 'clCyan',
            	'E': 'clCyan',

            	'N': 'clMagenta',
            	'Q': 'clMagenta',

            };
        }
    },
    
    //----------------------------------    
    // obtiene el color de una base
    //----------------------------------
    colorOf: function(base){
      return this.colors[base];
    },
    
});

// Clase para gestionar el dibujado del alineamiento
var TAlignment = Class.create({

  // 'tmpdata/' + runid + '/json/alignment.json'
  
  //----------------------------------
  // Constructor
  //----------------------------------
  initialize: function(runid,alphabet,loadDone) {
    this.runid = runid;
    
    this.loadDone = loadDone;
    
    this.threshold = 5;
    
    this.sequences = null;
    
    this.colors = new TColors(alphabet);
    
    // pide el archivo json al servidor, ojo que hay que hacer un bind o  al llamarse al callback no sabe quien es this
    new Ajax.Request(cgiPath+'download.cgi?F='+this.alignmentURL(), {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: this.alignmentDownloaded.bind(this) 
    });
    
  },

  //----------------------------------
  // alignmentURL
  //----------------------------------
  alignmentURL: function(){
    return this.runid + '/json/alignment.json';
  },
  
  // Callback llamado cuando se baja el fichero de alineamiento
  alignmentDownloaded: function (obj){
      this.sequences = obj.responseText.evalJSON(true);
      if (this.loadDone!=null) {
        this.loadDone('alignment');
      };
  },
  
  // Muestra el trozo de alineamiento indicado
  show: function(start,end,pos){
    
    // si existen las secuencias
    if (this.sequences != null) {
  		
      // crea una tabla nueva
  		var table = new Element('table',{'class':'alignmentTable','border':"0", 'cellspacing':"0",'cellpadding':"3"});
  		
  		var c;
	    var tr;
	    var td;
	    
  		// recorre el array de secuencias
  		for ( var s=0, len=this.sequences.length; s<len; s=s+2 ){
  		  
        // añade un row
  		  tr=new Element('tr',{'class':'alignmentTableTR','align':"center"});
  		  
        // añade una celda con el nombre
  			td = new Element('td');
  			td.update(this.sequences[s]);
  			tr.appendChild(td);
			
        // añade las bases de la secuencia, con un margen
  			for (var i=start-this.threshold; i <= end+this.threshold; i++) {
  			  c=this.sequences[s+1].charAt(i);

  				td = new Element('td',{'class':this.colors.colorOf(c)});
          // añade una celda con la base
          if ((i<start) | (i>end)) {
            
            // td.className='clNone';
            
            // td = new Element('td',{'class':'clNone'});
            
            td.addClassName('clTransparent');
          };
          
          

    			td.update(c);
    			tr.appendChild(td);
    			
  			};
			
        // añade el row a la tabla
			  table.appendChild(tr);
      
  		}
  		
  		// añade la barra inferior con pos

      // añade nueva row
  		tr=new Element('tr',{'class':'alignmentTableTR','align':"center"});

      // celda con el nombre de la row
			td = new Element('td');
      // td.update('['+start+' - '+end+']');
			td.update(pos);
			tr.appendChild(td);
			
      var posClass;
      
      // para cada posición
  		for (var i=start-this.threshold; i <= end+this.threshold; i++) {
  		  
  		  posClass='clNoPosition';
  		
        // cuando es bases de la posición se pintan distinto
  		  if ((i>=start) & (i<=end)){
  				posClass='clPosition';
  			};
  			
        // añade la celda con la posición
    		td = new Element('td',{'class':posClass});
  			td.update("&nbsp;");
  			tr.appendChild(td);
  			
			};
  		
			table.appendChild(tr);
      
		  var div = new Element('div',{'style':"width: 50px"});
  	
  		div.appendChild(table);
    
  		// poner resultados en el div
  		$('alignmentDIV').update(div);
  		
  	};
		
  }
  
});


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
