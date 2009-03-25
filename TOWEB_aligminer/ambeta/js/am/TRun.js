//=======================================
//Clase para gestionar el RUN
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TRun = Class.create({
  
  //Constructor
  initialize: function(id,jobList) {
    
    this.initVars(id,jobList);
    
    this.loadRun();
  },
  
  //----------------------------------
  // initVars
  //----------------------------------
  initVars: function(id,jobList){
    this.runid = id;
    // this.jobName = jobName;
    this.jobList = jobList;
    
    this.jobInfo = jobList.getByID(id);
    this.userid = jobList.processedUserName;
    
    
    // this.quickInfoUpdater = null;
    this.logger = null;

    this.alignment = null;
    
    this.adnWGraph = null;
    this.generalWGraph = null;
    this.entropyGraph = null;
    this.variabilityGraph = null;
    
    this.currentGraph = null;
    
    this.currentFrom = -1;
    this.currentTo = -1;
    this.currentPos = -1;
    
    this.currentRegion = null;
  },
  
  //----------------------------------
  // loadRun
  //----------------------------------
  loadRun: function(){
    var a;

    var tr = $('graphMenuRow');
    
    tr.update('');
    
    var alp = 'protein';
    
    if (this.jobInfo!=null) {
          alp = this.jobInfo.qinfo.alphabet;
    };
    
    if (alp!='protein'){
          this.adnWGraph = this.getGraphTD('adnW','ADNW','Similarity',tr);
    };
    
    this.generalWGraph = this.getGraphTD('generalW','WEIGHTED','Similarity',tr);
    this.entropyGraph = this.getGraphTD('entropy','ENTROPY','Entropy',tr);
    
    this.variabilityGraph= this.getGraphTD('variability','VARIABILITY','Variability',tr);
    
    this.alignment = new TAlignment(this.jobList.processedUserName+'/'+this.runid,alp,this.loadDone.bind(this));
    
    if (!$('resultsRowDiv').visible()){
      // muestra resultados
      miToggle('resultsRowDiv','resultsToggleImg',1.5);
    }
    
  },
  
  
  //----------------------------------
  // Envía fichero
  //----------------------------------
  uploadFile: function(){
    
    this.initVars();
    
    $('barraProgreso').show();
    
    // limpia regiones
    
  },
  
  //----------------------------------
  // jobSent
  //----------------------------------
  jobSent: function(obj){
      
      // alert(obj.responseText);
  },
  
  //----------------------------------
  // jobSentError
  //----------------------------------
  jobSentError: function(obj){
    // alert('error'+obj.responseText);
  },
  
  //----------------------------------
  // onCurrentGraphClick
  //----------------------------------
  onCurrentGraphClick: function(x){
    
    //$('evtInfo').insert('<br>evento en run,onGraphClick'+x);
    
    // buscar alguna region para esta posición
    
    var r1 = this.currentGraph.findAnyRegionAt(x);
    
    if (r1!=null) {
      //$('evtInfo').insert('<br>region at x:'+x+', is:'+r1.num);
      
      this.showPosition(r1.startPos,r1.endPos,r1.regionName,r1.num,false);
    };
      
    
  },
  
  //----------------------------------
  // loadDone
  //----------------------------------
  loadDone: function(name){
    
    var done =  (this.alignment != null) &
                (this.generalWGraph != null) &
                (this.entropyGraph != null) &
                (this.variabilityGraph != null);
                
    var alp = 'protein';

    if (this.jobInfo!=null) {
          alp = this.jobInfo.qinfo.alphabet;
    };

    if (alp!='protein'){
      done = done & (this.adnWGraph != null);
    }
            
                
    if (done) {
      $('graphMenuTable').appear();

			$('progresoGraph').fade();
			
			
      // $('evtInfo').update('run loaded');
    };
    
  },
  
  
  
  //----------------------------------
  // Obtiene la descripción de la gráfica
  //----------------------------------
  getGraphTD: function(graphName,graphTitle,yLabel,tr){
    
    /*
      FIX -No llamar al new varias veces.
    */
    var graph=this[graphName+'Graph'];
    
    var alp = 'protein';
    
    if (this.jobInfo!=null) {
          alp = this.jobInfo.qinfo.alphabet;
    };
    
    // si no se creo antes, crearla ahora
    if ( graph == null) {
       // alert('creando gráfica:'+graphName);
       graph = new TAMGraph(graphName,graphTitle,yLabel,this.userid+'/'+this.runid,alp,'graphDIV',this.loadDone.bind(this));
       
       // Cuando se hace un click en la gráfica, se llama a este método
       graph.onGraphClick = this.onCurrentGraphClick.bind(this);
       
       // graph.observe('graph:oneclick', function(event) { 
       //           $('evtInfo').insert('evento graph,oneclick');
       //         });
       
    };
    
    var a = new Element('a',{'href':"javascript:run.showGraph('"+graphName+"Graph');"});
    
    a.update(graphTitle);
    
    var td = new Element('td',{'width':'100', 'nowrap':"nowrap", 'id':graphName+'Graph'});
    
    // <td width="100" align="center" nowrap="nowrap"><a href="javascript:getImg('adnW.png','graphDIV',RUNID);">GENERALW</a>
    // </td>
    
    td.appendChild(a);
    
    tr.appendChild(td);
    
    return graph;
  },
  
  
  //----------------------------------
  // showPosition
  //----------------------------------
  showPosition: function(from,to,regionName,pos,centering){
    
    // Hay que buscar la página en la que esta
    this.currentGraph.showRegionInTable(regionName,pos);
    
    // si hay definido un elemento
    if ((this.currentRegion!=null) & (this.currentPos>=0)) {
      // y existe 
      if ($(this.currentRegion+this.currentPos)) {
 $(this.currentRegion+this.currentPos).removeClassName('regionTableTRResaltada');
      };
    };
    
      this.alignment.show(from,to,regionName.substr(0,4)+'-'+pos);
    
      if (centering) {
            this.currentGraph.graphBoard.centerGraphsAt(from,to,0,true,true);
      }else{
        this.currentGraph.graphBoard.selectRange(from,to);
        this.currentGraph.graphBoard.paint(false);
      };
    
      this.currentFrom = from;
      this.currentTo = to;
      this.currentPos = pos;
      this.currentRegion = regionName;
    
      // resalta la línea de la tabla de regiones actual
      $(this.currentRegion+this.currentPos).addClassName('regionTableTRResaltada');
      
      $('alignmentDIV').show();
    
  },
  
  //----------------------------------
  // showGraph
  //----------------------------------
  showGraph: function(graph){
    this[graph].showGraph();
    
    if (this.currentGraph!=null) {
      $(this.currentGraph.graphName+'Graph').removeClassName('graficaResaltada');
    };
    
    this.currentGraph=this[graph];
    
    $(this.currentGraph.graphName+'Graph').addClassName('graficaResaltada');
    
    $('xScale').update((this.currentGraph.graphBoard.xScale*100)+'%');
    
    $('graphOptionsDiv').appear();
		$('contenidoRunTR').appear();
    $('graphCanvas').appear();
    
    $('alignmentDIV').hide();
  },
  
  //----------------------------------
  // incXScale
  //----------------------------------
  incXScaleBy: function(inc){
    
    if (((this.currentGraph.graphBoard.xScale*inc)>=0.0625) & ((this.currentGraph.graphBoard.xScale*inc)<=16)){
      
      var cpos = this.currentGraph.graphBoard.getXEndPos();
      
 this.currentGraph.graphBoard.scaleXTo(this.currentGraph.graphBoard.xScale*inc,false);
      
      /*
        TODO - Al reducir escala estando al final falla
      */
      
      $('xScale').update((this.currentGraph.graphBoard.xScale*100)+'%');
      
      this.currentGraph.graphBoard.centerGraphsAt(cpos,cpos,1,false,false);
      
      if (this.currentFrom>=0) {
        this.showPosition(this.currentFrom,this.currentTo,this.currentRegion,this.currentPos,true);
      }else{
        this.currentGraph.graphBoard.paint(false);
      };
      
      
      // this.currentGraph.graphBoard.paint(false);
      
      // $('evtInfo').update('cpos:'+cpos);
      
    };
  },
  
  
});