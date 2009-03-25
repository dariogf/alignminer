//=======================================
//Clase para pintar una gráfica
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TGraph = Class.create(TGraphObject, {
  
  //Constructor
  initialize: function($super,graphBoardObject,color,data) {
    $super(graphBoardObject,color);
    
    this.data = data;
    
    this.maxValue = this.data.max();
    this.minValue = this.data.min();
    
    var scaY = Math.round(this.graphBoardObject.height()/(this.maxValue-this.minValue));

    $('evtInfo').update('sca:'+this.minValue+','+this.maxValue+','+scaY);
    
    this.setScaleX(4);
    this.setScaleY(scaY);

    this.setOffsetX(0);
    this.setOffsetY(Math.round((this.maxValue-this.minValue)/2)*this.yScale);
    
  },
  
  //----------------------------------
  // determina si se puede establecer este offsetX
  //----------------------------------
  canOffsetX: function(x){
    var res =false;
    
    var le = Math.floor(this.graphBoardObject.width()/this.xScale);
    
    if (((0-x)>0) & ((le-x)<this.data.length)) {
      res=true;
    };
    
    return res;
  },

  //----------------------------------
  // determina si se puede establecer este offsetY
  //----------------------------------
  canOffsetY: function(y){
    var res =true;
        
    return res;
  },
  
  //----------------------------------
  // pintar
  //----------------------------------
  paint: function(canvas){
    
    
      // canvas.save();
    // canvas.lineWidth = 1/4;
        // canvas.scale(8,1);
        
    // canvas.strokeStyle = "rgba(255,255,0,0.2)";
    canvas.strokeStyle = this.color;
    
    canvas.beginPath();
    
    canvas.moveTo(0,(this.offy+this.data[0-this.offx])*this.yScale);
    // canvas.moveTo(0,(this.data[0-this.offx]));
    
    // limite de dibujado
    var le = Math.floor(this.graphBoardObject.width()/this.xScale);
    
    for (var i=1; i < le; i++) {
   canvas.lineTo((i*(this.xScale)),(this.offy+this.data[i-this.offx])*this.yScale);
     // canvas.lineTo((i),(this.offy+this.data[i-this.offx]));
    };
    
    // pinta el path
    canvas.stroke();
    
    // canvas.restore();
    
    // $('evtInfo').update('w:');
  },
  
});
