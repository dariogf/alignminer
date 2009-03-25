//=======================================
//Clase para gestionar la información preliminar del alineamiento
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TQuickInfo = Class.create({

  //Constructor
  initialize: function(runid) {
    this.runid = runid;
    this.qinfo = null;
    
    this.quickInfoPerEx = null;
    this.getQuickInfo();
  },

  //----------------------------------
  // Obtiene la url del ficher quickinfo
  //----------------------------------
  quickInfoURL: function(){
    return (cgiPath+'download.cgi?F=' + this.runid + '/json/alignInfo.json');
  },
  
  //----------------------------------
  // Obtiene el fichero quick info
  //----------------------------------
  getQuickInfo: function(){
    
    //alert('getQuickInfo this:'+this.runid);
    
    this.quickInfoPerEx = new PeriodicalExecuter((function (pe){
        // pide el archivo json al servidor
        new Ajax.Request(this.quickInfoURL(), {
          method:'get',
          requestHeaders: {Accept: 'application/text'},
          onSuccess: this.processReceivedQuickInfo.bind(this)
        });
    }).bind(this), 2);
    
  },
    
  //----------------------------------
  // Procesa la información del quickinfo
  //----------------------------------
  processReceivedQuickInfo: function(obj){
        
    // parsea el texto
    this.qinfo = obj.responseText.evalJSON(true);
    // JSON;
    
    // tipoFichero
    $('fileType').innerHTML = 'File type:' + this.qinfo.fileType;

    // tipoSecuencia (and/protein)
    $('sequenceType').innerHTML = 'Sequence type:'+this.qinfo.alphabet;

    // alineamiento
    $('alignmentLength').innerHTML = 'Alignment length:'+this.qinfo.length;

    // num secuencias
    $('numberOfSequences').innerHTML = 'Number of sequences:'+this.qinfo.numberOfSequences;

    // añade las secuencias
    for (var i=0; i < this.qinfo.sequences.length; i++) {
        $('sequenceList').options[i] = new Option(this.qinfo.sequences[i]);
    };

    $('barraProgreso').hide();
    $('informationDIV').appear();
    
    
    $('formsDiv').hide();
    $('formRunDIV').show();
    $('formFileUploadDIV').hide();
    $('formsDiv').appear();

    // para el proceso que se baja los logger
    this.quickInfoPerEx.stop();
    
  }

});
