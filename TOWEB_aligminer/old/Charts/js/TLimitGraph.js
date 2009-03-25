//=======================================
//Clase para pintar los límites en la gráfica
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TLimitGraph = Class.create(TGraphObject, {

  //Constructor
  //Constructor
  initialize: function($super,graphBoardObject,color,limit1,limit2) {
    $super(graphBoardObject,color);
    
    this.limit1 = limit1;
    this.limit2 = limit2;
    
  },
  
  //----------------------------------
  // pintar
  //----------------------------------
  paint: function(canvas){
    
    // canvas.strokeStyle = "rgba(255,255,0,0.2)";
    canvas.strokeStyle = this.color;
        
    // limite de dibujado
    var le = Math.floor(this.graphBoardObject.width()/this.xScale);
    
    canvas.beginPath();
    
    canvas.moveTo(0,this.limit1*this.yScale);
    canvas.lineTo(this.graphBoardObject.width(),this.limit1*this.yScale);
    
    // pinta el path
    canvas.stroke();
    
    // segundo limite
    canvas.beginPath();
    
    canvas.moveTo(0,this.limit2*this.yScale);
    canvas.lineTo(this.graphBoardObject.width(),this.limit2*this.yScale);
    
    // pinta el path
    canvas.stroke();
    
  },
  
});