//=======================================
//Clase para gestionar los loggers
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TLogger = Class.create({

  //Constructor
  initialize: function(runid,run) {
    this.runid = runid;
    this.run = run;
        
    this.logger = new PeriodicalExecuter((function(pe){
      
        // pide el archivo al servidor
        // new Ajax.Request(this.logURL(), {
          
        new Ajax.Request(cgiPath+'download.cgi?F='+this.logURL(), {
          method:'get',
          requestHeaders: {Accept: 'application/text'},
          onSuccess: this.processReceivedLog.bind(this)
        });
    }).bind(this), 2);
  },
  
  //----------------------------------
  // Obtiene el fichero log del servidor
  //----------------------------------
  // retrieveLog: function(pe){
  //   
  //     // pide el archivo al servidor
  //     new Ajax.Request(this.logURL, {
  //       method:'get',
  //       requestHeaders: {Accept: 'application/text'},
  //       onSuccess: this.processReceivedLog.bind(this)
  //     });
  // },
  
  //----------------------------------
  // obtiene el URL del log
  //----------------------------------
  logURL: function(){
    return this.runid+'/log.txt';
  },
  
  //----------------------------------
  // procesa el fichero log
  //----------------------------------
  processReceivedLog: function(obj){
    // parsea el texto
  	var texto = obj.responseText;
  	
  	var hasGraph=false;

      texto = this.convertText2HTML(texto);

      // // num secuencias
      // grupos = texto.match(/Number of sequences found in alignment: (\d+)/);
      // 
      // if (grupos != null) {
      //     $('numberOfSequences').innerHTML = 'Number of sequences:'+grupos[1];
      // };
      
      var stage = 0;
      
      var a;

      var tr = $('graphMenuRow');
      
      tr.update('');
      
      // var td = new Element('td',{'class':"separadorV"});
      // td.update('&nbsp;');
      // 
      // tr.appendChild(td);
      
      var hasADNW = 0;
      
      if (texto.search(/Processing alignment/g)!=-1) {
          stage ++;
          
          if (texto.search(/Consensus calculated/g)!=-1) {
              stage++;
              
              if (texto.search(/Calculating Function adnW/g)!=-1) {
                  hasADNW=1;
                  stage++;
              };
              
              if (texto.search(/Calculating Function generalW/g)!=-1) {
                  stage++;
                  
                  if (hasADNW==1) {
                    
                      this.run.adnWGraph = this.run.getGraphTD('adnW',tr);
                      hasGraph=true;
                      // tr.appendChild(td);
                      
                      // graphsMenu=graphsMenu+'<td class="textoMenu2" align="left" nowrap="nowrap"><a href="javascript:getImg(\'adnW\',\'graphDIV\',RUNID);">ADN&nbsp;|</a></td>';

                  }else{
                      stage++;
                  };

                  if (texto.search(/Calculating Function entropy/g)!=-1) {
                      stage++;

                      this.run.generalWGraph = this.run.getGraphTD('generalW',tr);
                      hasGraph=true;
                      // tr.appendChild(td);
                                            
                      // graphsMenu=graphsMenu+'<td class="textoMenu2" align="left" nowrap="nowrap"><a href="javascript:getImg(\'generalW\',\'graphDIV\',RUNID);">GENERAL&nbsp;|</a></td>';

                      if (texto.search(/The END\./g)!=-1){
                        
                         stage++;
                         stage++;
                        
                         // graphsMenu=graphsMenu+'<td class="textoMenu2" align="left" nowrap="nowrap"><a href="javascript:getImg(\'entropy\',\'graphDIV\',RUNID);">ENTROPY&nbsp;|</a></td>';
                        
                         this.run.entropyGraph = this.run.getGraphTD('entropy',tr);
                         // tr.appendChild(td);
                         hasGraph=true;
                        
                         texto = texto+ '<br /> LOGGER FINALIZADO.';
                        
                         // para el proceso que se baja los logger
                         this.logger.stop();
                         this.run.finished();
                        
                      };
                  };
              };
          };        
      };
      
      if (hasGraph) {
        if (!$('resultsRowDiv').visible()){
          // muestra resultados
          miToggle('resultsRowDiv','resultsToggleImg',1.5);
        }
      };
      
      // td = new Element('td',{'id':'graphOptions','width':"100%"});
      // 
      // td.update('&nbsp;&nbsp;<a href="javascript:run.currentGraph.graphBoard.centerGraphsAt(0,0,-1,false,true);">|&lt;</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:run.currentGraph.graphBoard.centerGraphsAt(run.currentGraph.graphBoard.dataLength,run.currentGraph.graphBoard.dataLength,1,false,true);">&gt;|</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;X scale [<span id="xScale">200%</span>]:&nbsp;&nbsp;<a href="javascript:run.incXScaleBy(0.5);">(-)</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:run.incXScaleBy(2);">(+)</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:run.currentGraph.downloadSnapshotURL();">Snapshot</a>&nbsp;&nbsp;');
      // 
      // tr.appendChild(td);
      
      // graphsMenu=graphsMenu+'<td width="100%"></td>';
      // $('graphMenuRow').update(tr);
      
      // $('graphOptionsTD').hide();

      var imgStage = new Element('img',{'src':"images/stage"+stage+".png", 'alt':""});
      var imgText = new Element('img',{'src':"images/stagesText.png", 'alt':""});
      
      //añade los stages
      // $('hitosProgreso').update(null);
      $('hitosProgreso').update(imgStage);
      $('hitosProgresoText').update(imgText);
      
  },
  
  //----------------------------------
  // Convierte texto a html
  //----------------------------------
  convertText2HTML: function(itext){
    
        var lineBreak = '<br />';
        
        var texto = itext;
        
        texto = texto.replace(/\r\n/g,lineBreak);
        texto = texto.replace(/\n/g,lineBreak);
        texto = texto.replace(/\r/g,lineBreak);
        
        return texto;
  }
  

});
