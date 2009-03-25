//=======================================
//Clase para pintar los límites en la gráfica
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TLimitGraph = Class.create(TGraphObject, {

  //Constructor
  initialize: function($super,graphBoardObject,color,limit1,limit2) {

    
    this.limit1 = limit1;
    this.limit2 = limit2;
    
    
    this.maxValue = Math.max(limit1,limit2);
    this.minValue = Math.min(limit1,limit2);

    // $('evtInfo').insert('<br>limit, min,max:'+this.minValue+','+this.maxValue);
  
    // llamar el constructor al final para que añada la grafica al objeto graphboard con los datos ya rellenos. 
    $super(graphBoardObject,color);
    
  },
  
  //----------------------------------
  // pintar
  //----------------------------------
  paint: function(canvas,dragging){
    
    canvas.props.lineWidth = 1.5;
    // canvas.strokeStyle = "rgba(255,255,0,0.2)";
    canvas.props.strokeStyle = this.color;
        
    // limite de dibujado
    
    // canvas.horLine(this.limit1);
    canvas.horLineSized(this.limit1,0,this.graphBoardObject.visibleWidth()/this.graphBoardObject.xScale);
    
    // canvas.horLine(this.limit2);
    canvas.horLineSized(this.limit2,0,this.graphBoardObject.visibleWidth()/this.graphBoardObject.xScale);
    
    
  },
  
});