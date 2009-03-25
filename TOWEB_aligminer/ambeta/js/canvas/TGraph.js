//=======================================
//Clase para pintar una gráfica
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TGraph = Class.create(TGraphObject, {
  
  //Constructor
  initialize: function($super,graphBoardObject,color,data,regionsCONSERVATION,regionsSNP,regionsDIVERGENCE) {
    
    this.data = data;
    
    this.regionsCONSERVATION = regionsCONSERVATION;
    this.regionsSNP = regionsSNP;
    this.regionsDIVERGENCE = regionsDIVERGENCE;
        
        
    this.maxValue = this.data.max();
    this.minValue = this.data.min();
    
    this.dataLength = this.data.length;

    $super(graphBoardObject,color);
    
  },
  
  //----------------------------------
  // pintar
  //----------------------------------
  paint: function(canvas,dragging){
    
    // canvas.save();
    // canvas.lineWidth = 1/4;
    
    // canvas.props.strokeStyle = "rgba(255,255,0,0.2)";
    canvas.props.strokeStyle = this.color;
    canvas.props.lineWidth = 1;
    
    var p = (-1)*Math.round(this.xScroll / canvas.xScale);
    
    var ini=0;
    
    if (p<0) {
      ini=-p;
    }
    
    // era canvas.width
    // limite de dibujado
    // var fin = Math.floor(this.graphBoardObject.visibleWidth() / canvas.xScale);
    var fin = Math.floor(canvas.width / canvas.xScale);
    
    if (p+fin>this.data.length) {
      fin=this.data.length-p;
    };
    
    // $('evtInfo').update('<br>p,ini,fin:'+p+','+ini+','+fin);

    canvas.beginPath();


    var oldY=this.data[ini+p];
    var newY=0;
    
    
    
    canvas.moveTo(ini,oldY);
    
    // var pp=0;
    // pinta la gráfica dentro del path
    for (var i=ini+1; i < fin; i++) {

      // newY=this.data[i+p];
      // se hace un redondeo para que el drag sea más efectivo
      if (!dragging) {
          newY=this.data[i+p];
      }else{
          newY=this.data[i+p].toFixed(1);
      };
      
      /*
        SHOW OPTIMIZAR : cuando hay muchos valores juntos que son iguales, pintar sólo una línea. Esto sirve mucho para las gráficas de adn que son muy lisas.
      */
      if (newY!=oldY) {
        canvas.lineTo(i-1,oldY);
        canvas.lineTo(i,newY);
        
        // pp++;
        // pp++;

        oldY=newY;
      };
      
    };
    // dibuja la última posición
    canvas.lineTo(fin,oldY);

    // pinta el path
    canvas.stroke();
    
    // pinta los datos de regiones 
    
    // if (!dragging) {
    //   
    //   // pinta Convergencia
    //   this.paintLabels(canvas,this.regionsCONSERVATION,ini,fin,p,'C','#00FF00',12);
    // 
    //   // pinta SNP
    //   this.paintLabels(canvas,this.regionsSNP,ini,fin,p,'S','#0000FF',24);
    //   
    //   // pinta Divergencia
    //   this.paintLabels(canvas,this.regionsDIVERGENCE,ini,fin,p,'D','#FF0000',36);
    //   
    // };
    
    
    
    // $('evtInfo').update('<br>points painted:'+(pp)+', of:'+(fin-ini)+','+newY);
    // $('evtInfo').insert('<br>i:'+(0-p)+', le:'+(i-p));
    
    
    // canvas.restore();
    
    // $('evtInfo').update('w:');
  },
  
  //----------------------------------
  // paintLabels
  //----------------------------------
  paintLabels: function(canvas,regionsObject,ini,fin,p,title,color,vspace){

    if (regionsObject!=null) {
      canvas.props.strokeStyle=color;
      
      var startRegion=regionsObject.findNextRegion(ini+p);
      var endRegion=regionsObject.findPrevRegion(fin+p);
      
      if ((startRegion[0]!=null) & (endRegion[0]!=null)) {
        
        for (var i=startRegion[0]; i <= endRegion[0]; i++) {
      
          canvas.drawText('sans', 8, regionsObject.regions[i].startPos-p, this.graphBoardObject.minValue+(vspace/this.graphBoardObject.yScale),title+i);
        };
      };
      
    };
    
  },
  
  
});
