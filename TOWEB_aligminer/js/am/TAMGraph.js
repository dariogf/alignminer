//=======================================
//Clase para gestionar las gráficas
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

// "tmpdata/'+runid+'/graphs/'+ functionName +'.png"

var TAMGraph = Class.create({

  //Constructor
  initialize: function(graphName,graphTitle,yLabel,runid,type,destination,loadDone) {
    this.graphName = graphName;
    
    this.graphTitle = graphTitle;
    this.yLabel = yLabel;
    
    this.loadDone = loadDone;
    
    this.destination = destination;
    this.runid=runid;
    this.type = type;
    
    this.onGraphClick = null;
    
    this.normalData = null;
    this.fftData = null;
    this.normalLimits = null;
    this.fftLimits = null;
    
    this.graphBoard = null;
    
    this.regionsCONSERVATION = null;
    this.regionsDIVERGENCE = null;
    this.regionsSNP = null;
    
    this.getData();
    
  },

  //----------------------------------
  // loadRegionDone
  //----------------------------------
  loadRegionDone: function(regName){
    var done = false;
    
    done =  (this.regionsCONSERVATION!=null) &
            (this.regionsDIVERGENCE != null) & 
            (this.regionsSNP != null) &
            (this.normalData != null) &
            (this.fftData != null) &
            (this.normalLimits != null) &
            (this.fftLimits != null);

    if ((done) & (this.loadDone!=null)) {
		  this.loadDone(this.graphName);
		};
		
  },
  
  
  //----------------------------------
  // getData
  //----------------------------------
  getData: function(){

    // pide el archivo json al servidor para datos normales:
    new Ajax.Request(cgiPath+'download.cgi?F='+this.runid+'/json/'+ this.graphName +'.json', {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: this.processNormalData.bind(this)
    });
    
    // pide el archivo json al servidor para datos normales:
    new Ajax.Request(cgiPath+'download.cgi?F='+this.runid+'/json/'+ this.graphName +'fft.json', {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: this.processFftData.bind(this)
    });
    
    // pide el archivo json al servidor para datos normales:
    new Ajax.Request(cgiPath+'download.cgi?F='+this.runid+'/json/'+ this.graphName +'_LIMIT.json', {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: this.processNormalLimits.bind(this)
    });
    
    // pide el archivo json al servidor para datos normales:
    new Ajax.Request(cgiPath+'download.cgi?F='+this.runid+'/json/'+ this.graphName +'_LIMIT_FFT.json', {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: this.processFftLimits.bind(this)
    });
    
  },
  
  //----------------------------------
  // Procesa datos normales descargados
  //----------------------------------
  processNormalData: function(obj){
    
    // obtiene el objeto JSON
		this.normalData = obj.responseText.evalJSON(true);
		this.checkAllDataAvailable();
	},
  
  //----------------------------------
  // Procesa datos descargados
  //----------------------------------
  processFftData: function(obj){
    
    // obtiene el objeto JSON
		this.fftData = obj.responseText.evalJSON(true);
		this.checkAllDataAvailable();
	},
	
	//----------------------------------
  // Procesa datos descargados
  //----------------------------------
  processNormalLimits: function(obj){
    
    // obtiene el objeto JSON
		this.normalLimits = obj.responseText.evalJSON(true);
		this.checkAllDataAvailable();
	},
	
	//----------------------------------
  // Procesa datos descargados
  //----------------------------------
  processFftLimits: function(obj){
    
    // obtiene el objeto JSON
		this.fftLimits = obj.responseText.evalJSON(true);
		this.checkAllDataAvailable();
	},
	
	
	//----------------------------------
	// onOneClickGraphBoard
	//----------------------------------
	onOneClickGraphBoard: function(x){

    if (this.onGraphClick!=null) {

      //$('evtInfo').insert('<br>AMGraph: oneclick:'+x);
      
      this.onGraphClick(x);
    };
        // this.fire('graph:oneclick');
	      

	},
	
	
	//----------------------------------
	// checkAllDataAvailable
	//----------------------------------
	checkAllDataAvailable: function(){
	  
	  if ((this.normalData != null) & (this.fftData != null) & (this.normalLimits != null ) & (this.fftLimits!= null)  ) {
	    
	    // si todos los datos están disponibles, crea las regiones.
			this.regionsCONSERVATION = new TRegions('CONSERVATION',this.runid, this.graphName ,'aboveFFT','aboveTD',this.loadRegionDone.bind(this),'Sequence identity too high to determine specific conserved motives',false);
      // 
      this.regionsDIVERGENCE = new TRegions('DIVERGENCE',this.runid, this.graphName ,'belowFFT','belowTD',this.loadRegionDone.bind(this),'Sequences can be considered identical, or too few sequences were provided',false);
      //
      
        

      this.regionsSNP = new TRegions('SNP',this.runid, this.graphName ,'snp','snpTD',this.loadRegionDone.bind(this),'No SNP found, or too few sequences were provided', (this.type=='protein'));
      
      			
	    // crea la gráfica
  	  this.graphBoard = new TGraphBoard('graphCanvas');
  	  
  	  this.graphBoard.oneClick = this.onOneClickGraphBoard.bind(this);
  	  
      // this.graphBoard.observe('graphBoard:oneclick', onOneClickGraphBoard.bind(this));
      
		
  		var xg = new TXGrid(this.graphBoard,'#C8CACA',50);
  		var yg = new TYGrid(this.graphBoard,'#C8CACA',2,this.yLabel);
		
  		var g1 = new TGraph(this.graphBoard,'#FF0E06',this.normalData,null,null,null);
		
      // var l1 = new TLimitGraph(this.graphBoard,'#FF0803',this.normalLimits.limit1,this.normalLimits.limit2);
		
  		var g2 = new TGraph(this.graphBoard,'#3811F0',this.fftData,this.regionsCONSERVATION,this.regionsSNP,this.regionsDIVERGENCE);
		  
  		var l2 = new TLimitGraph(this.graphBoard,'#1622F1',this.fftLimits.limit1FFT,this.fftLimits.limit2FFT);
  		
  		var ysep = ((this.graphBoard.maxValue-this.graphBoard.minValue));
			
			ysep=Math.round(ysep)/10;
			
			yg.separation = ysep;
  		
	  };
		
	},
	
  //----------------------------------
  // Obtiene la gráfica
  //----------------------------------
  showGraph: function(){
    
    // borra snapshots
    $('snapshotsTR').update('');
    
    $('graphCanvas').hide();
    $('regionsTable').show();
		$('alignmentDIV').show();
    // $('alignmentResultDIV').show();
		
		
		this.graphBoard.removeEvents();
		this.graphBoard.addEvents();
    
		
    // var div = new Element('div',{'style':"width: 50px"});
    // 
    // var img = new Element('img',{'src':this.graphURL(), 'width':"2500px", 'height':"400px", 'alt':"text" });
    
    // <canvas id="graphCanvas" height=200 width=900></canvas>                        
    
    // div.appendChild(img);
    
    // $(this.destination).update(div);
    
    // this.graphBoard.paint();
		
    if (this.regionsCONSERVATION!=null){
      this.regionsCONSERVATION.showRegions();
    };
    
    // 
    if (this.regionsDIVERGENCE!=null){
      this.regionsDIVERGENCE.showRegions();
    };
    
    //
    if (this.regionsSNP!=null){
      this.regionsSNP.showRegions();
    };
    
    $('graphCanvas').show();
    
    $('regionsTable').show();
		
		$('alignmentDIV').show();
    // $('alignmentResultDIV').show();
		
		this.graphBoard.centerGraphsAt(0,0,-1,false,false);
		
		this.graphBoard.paint();
    
  },
  
  //----------------------------------
  // downloadSnapshotURL
  //----------------------------------
  downloadSnapshotURL: function(){
  
    var micanvas = $('graphCanvas');

    // create a data url from the canvas
    var midataUrl = micanvas.toDataURL('image/png');
    
    // create a data url from the canvas
    
    var td = new Element('td');
    var a = new Element('a',{'href':midataUrl, 'target':'_blank'});
    // var a = new Element('a',{'href':midataUrl.replace('image/png', 'image/octet-stream')});
    
    a.update('<img src='+midataUrl+' width="90px" height="30px" border="0" alt="Snap.png">');
    td.update(a);
    //'<img src="'+midataUrl+'" width="90px" height="30px" border="0" alt="Snap">');
    $('snapshotsTR').appendChild(td);

    // para forzar descarga
		//document.location.href = midataUrl.replace('image/png', 'image/octet-stream');

  },
  
  //----------------------------------
  // findAnyRegionAt
  //----------------------------------
  findAnyRegionAt: function(x){
        
    var reg =null;

    if (reg==null) {
      reg = this.regionsSNP.findRegionAt(x,4);
      if (reg!=null) {
          reg.regionName='SNP';
      };
    };
    
    if (reg==null) {
      reg = this.regionsDIVERGENCE.findRegionAt(x,2);
      if (reg!=null) {
          reg.regionName='DIVERGENCE';
      };
    };
    
    if (reg==null) {
      reg = this.regionsCONSERVATION.findRegionAt(x,2);
      if (reg!=null) {
        reg.regionName='CONSERVATION';
      };
    };
    
    return reg;
  },
  
  //----------------------------------
  // showRegionInTable
  //----------------------------------
  showRegionInTable: function(regionName,pos){
    
    this['regions'+regionName].showPageOfRegion(pos);
    
  },
  
  
});
