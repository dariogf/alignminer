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
    
    this.thresholdLeft = 5;
    this.thresholdRight = 5;
    
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
  			for (var i=start-this.thresholdLeft; i <= end+this.thresholdRight; i++) {
          // only show valid positions
  			  if ((i>=0) & (i<this.sequences[s+1].length)) {
  			    
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
  		for (var i=start-this.thresholdLeft; i <= end+this.thresholdRight; i++) {
  		  // only show valid positions
			  if ((i>=0) & (i<this.sequences[1].length)) {
        
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
			};
  		
			table.appendChild(tr);
			
      // // crea una tabla nueva para los resultados
      //       var result_table = new Element('table',{'width':'100%','class':'AlignmentResultTable','border':"0", 'cellspacing':"0",'cellpadding':"3"});
      //       
      //       
      //       tr=new Element('tr',{'align':"center"});
      //       
      //       td = new Element('td');
      //       td.update('<a href="javascript:run.incThresholdLeft(1);">&nbsp;&larr;&nbsp;</a>');
      //       tr.appendChild(td);
      //       
      //       td = new Element('td');
      //       td.update('<a href="javascript:run.incThresholdLeft(-1);">&rarr;&nbsp;</a>');
      //       tr.appendChild(td);
      //       
      //       td = new Element('td');
      //       td.update('<a href="javascript:run.getOligos();">&nbsp;OLIGO&nbsp;</a>');
      //       tr.appendChild(td);
      //       
      //       td = new Element('td');
      //       td.update('<a href="javascript:run.incThresholdRight(-1);">&nbsp;&larr;&nbsp;</a>');
      //       tr.appendChild(td);
      //       
      //       td = new Element('td');
      //       td.update('<a href="javascript:run.incThresholdRight(1);">&rarr;&nbsp;</a>');
      //       tr.appendChild(td);
      //            
      //      result_table.appendChild(tr);
  		
      // tr=new Element('tr',{'align':"center"});
      //       td = new Element('td',{'colspan':'"5"'});
      //       td.update('<div id="oligoDIV"></div>');
      //       tr.appendChild(td);
      //       
      // result_table.appendChild(tr);
      
  		
		  var div = new Element('div',{'style':"width: 50px"});
  	  
  		div.appendChild(table);
      // div.appendChild(result_table);
    
  		// poner resultados en el div
  		$('alignmentDIV').update(div);
  		
      // $('alignmentResultDIV').appendChild(result_table);
  		  		
      // var oligodiv = new Element('div',{'id':'oligoDIV'});
      //       
      // $('alignmentResultDIV').appendChild(oligodiv);
  		
  	};
		
  },
  
  // Muestra el trozo de alineamiento indicado
  getOligoSequence: function(start,end,pos){
    
     // alert(this.sequences);
     
    res = {};
    j= ' ';
    
    seqs = '';
    
    // si existen las secuencias
    if (this.sequences != null) {
           
     // recorre el array de secuencias
     for ( var s=0, len=this.sequences.length; s<len; s=s+2 ){
       seq_name = this.sequences[s];

       seq='';
       

        // añade las bases de la secuencia, con un margen
       for (var i=start-this.thresholdLeft; i <= end+this.thresholdRight; i++) {
          // only show valid positions
         if ((i>=0) & (i<this.sequences[s+1].length)) {
           
           seq+=this.sequences[s+1].charAt(i);
          
         };
       };
       
       res[seq_name] = seq;
       // seqs += ' '+seq;
      
      };
    };
    
    
    // if seqs !=''
    
    seqs= JSON.stringify(res);
    
    if (seqs!='') {
      
      new Ajax.Request(cgiPath+'runCmdGetJSON.cgi?SEQ=\''+seqs+'\'', {
        method:'get',
        requestHeaders: {Accept: 'application/json'},
        onSuccess: this.showOligoSequence.bind(this) 
      });
      
      
    };
    
    // return seqs;
		
  },
    
  // Muestra el trozo de alineamiento indicado
  showOligoSequence: function(obj){
    var oligos = obj.responseText.evalJSON(true);
    
    
    // var res = 'seq&nbsp;&nbsp;gc&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hairpin&nbsp;&nbsp;&nbsp;dimer<br>';
    var res = $('oligoDIV');
    
    res.update('');
        
    if ((res!= null) & (oligos != null)) {

      var oligo_table = new Element('table',{'width':'90%','class':'oligoTable','border':"0", 'cellspacing':"0",'cellpadding':"3"});

      // add table headers
      var tr = new Element('tr');
    
      // seq name
      var td = new Element('th');
      td.update('Name');
      tr.appendChild(td);
    
      // seq bases
      var td = new Element('th');
      td.update('Oligo sequence');
      tr.appendChild(td);
      
      var td = new Element('th');
      td.update('Size');
      tr.appendChild(td);
    
      // gc
      var td = new Element('th');
      td.update('%GC');
      tr.appendChild(td);
    
      // melting temp
      var td = new Element('th');
      td.update('Tm');
      tr.appendChild(td);
    
      // hairpins
      var td = new Element('th');
      td.update('Hairpins');
      tr.appendChild(td);
    
      // dimmers
      var td = new Element('th');
      td.update('Dimers');
      tr.appendChild(td);
    
      // add row
      oligo_table.appendChild(tr);
      
      for (var i in oligos) {
        if (oligos[i]!=null){
          if ((oligos[i]['error']==null)) {
            if (oligos[i]['hairpintext']!=null) {
            
              // var oligo_table = new Element('table',{'width':'90%','class':'oligoTable','border':"0", 'cellspacing':"0",'cellpadding':"3"});
                                         
              var tr = new Element('tr');
            
              // seq name
              var td = new Element('td');
              td.update(i);
              tr.appendChild(td);
            
            
              var seq = oligos[i]['seq'];
              
              seq = seq.split('').join('<wbr>');
              
              // seq = seq.split('').join('&shy;')
              // seq = seq.split('').join('</span><span>');
              //               seq ='<span>'+seq+'</span>';
              
              
              // seq bases
              // var td = new Element('td',{'width':'100px'});
              var td = new Element('td');
              // td.update('<pre>'+seq+'</pre>');
              td.update(seq);
              tr.appendChild(td);
            
              // seq size
              var td = new Element('td',{'width':'30px'});
              td.update(oligos[i]['length']);
              tr.appendChild(td);
            
              // gc
              var td = new Element('td',{'width':'30px','class':'oligoColor'+oligos[i]['gccolor']});
              td.update(oligos[i]['gc']);
              tr.appendChild(td);
            
              // melting temp
              var td = new Element('td',{'width':'30px','class':'oligoColor'+oligos[i]['tmcolor']});
              td.update(oligos[i]['tm']);
              tr.appendChild(td);
            
              // hairpins
              var td = new Element('td',{'class':'oligoColor'+oligos[i]['hairpincolor']});
              td.update(oligos[i]['hairpintext']);
              tr.appendChild(td);
            
              // dimmers
              var td = new Element('td',{'class':'oligoColor'+oligos[i]['dimercolor']});
              td.update(oligos[i]['dimertext']);
              tr.appendChild(td);
            
              // add row
              oligo_table.appendChild(tr);
            
              // // add table
              //             res.appendChild(oligo_table);
              //             
              //             // separator
              //             res.appendChild(new Element('br'));
              //             
    
            // res +=i+': '+ oligos[i]['gc']+'&nbsp;&nbsp;&nbsp;'+oligos[i]['hairpintext']+'&nbsp;&nbsp;&nbsp;'+oligos[i]['dimertext']+'<br>';         
            };
          }else{
            // res += 'ERROR:'+oligos[i]['error']+'<br>';
          };
        };
      };
    
      // add table
      res.appendChild(oligo_table);
    
      // separator
      res.appendChild(new Element('br'));
      
      res.style.opacity = 1;
    
    
    };
    
    // $('oligoDIV').update(res);
    
  },
  
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
