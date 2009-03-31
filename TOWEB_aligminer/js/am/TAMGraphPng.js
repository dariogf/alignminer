//=======================================
//Clase para gestionar las gráficas
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

// "tmpdata/'+runid+'/graphs/'+ functionName +'.png"

var TAMGraphPng = Class.create({

  //Constructor
  initialize: function(graphName,runid,type,destination) {
    this.graphName = graphName;
    this.destination=destination;
    this.runid=runid;
    this.type = type;
    
    this.regionsAbove = null;
    this.regionsBelow = null;
    this.regionsSNP = null;
    
  },
  
  //----------------------------------
  // graphURL
  //----------------------------------
  graphURL: function(){
    return 'tmpdata/'+this.runid+'/graphs/'+ this.graphName +'.png';
  },
  
  //----------------------------------
  // Obtiene la gráfica
  //----------------------------------
  showGraph: function(){
    
    $('graphDIV').hide();
    $('regionsTable').hide();
		$('alignmentDIV').hide();
		$('alignmentResultDIV').hide();
		
		
    var div = new Element('div',{'style':"width: 50px"});
    
    var img = new Element('img',{'src':this.graphURL(), 'width':"2500px", 'height':"400px", 'alt':"text" });
    
    div.appendChild(img);
    
  	$(this.destination).update(div);
    
    
    this.regionsAbove = new TRegions('CONSERVATION',this.runid, this.graphName ,'aboveFFT','aboveTD');
    // 
    this.regionsBelow = new TRegions('DIVERGENCE',this.runid, this.graphName ,'belowFFT','belowTD');

    //  
    this.regionsSNP = new TRegions('SNP',this.runid, this.graphName ,'snp','snpTD');
    
    $('graphDIV').show();
    
    $('regionsTable').show();
		
		$('alignmentDIV').show();
		$('alignmentResultDIV').show();
		
		
  }
  
});