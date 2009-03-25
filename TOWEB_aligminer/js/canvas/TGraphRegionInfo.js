//=======================================
//Clase para pintar una gráfica
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TGraphRegionInfo = Class.create(TGraphObject, {
  
  //Constructor
  initialize: function($super,graphBoardObject,color,regionData) {
    
    this.regionData = regionData;
        
    // this.maxValue = this.data.max();
    // this.minValue = this.data.min();
    
    // this.dataLength = this.data.length;
    
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
    
    
    
    
    // $('evtInfo').update('<br>points painted:'+(pp)+', of:'+(fin-ini)+','+newY);
    // $('evtInfo').insert('<br>i:'+(0-p)+', le:'+(i-p));
    
    // pinta el path
    canvas.stroke();
    
    // canvas.restore();
    
    // $('evtInfo').update('w:');
  },
  
});
