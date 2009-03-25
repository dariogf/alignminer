//=======================================
//Clase para pintar el eje Y
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TYGrid = Class.create(TGraphObject, {

  //Constructor
  initialize: function($super,graphBoardObject,color,separation,label) {
  
  this.label = label;
  this.separation = separation;

  graphBoardObject.yGridObject = this;

  $super(graphBoardObject,color);
    
  },
  
  //----------------------------------
  // pintar
  //----------------------------------
  paint: function(canvas,dragging){

      // canvas.beginPath();
      
      var ni=0;
      var s='';
      
      // barra vertical
      canvas.props.strokeStyle = '#000000';
      canvas.props.lineWidth = 1/2;
  
canvas.drawVerticalTextCenter('sans',10,10,this.graphBoardObject.visibleHeight()/2,this.label);

      if (!dragging) {
canvas.vertLineSized(0,this.graphBoardObject.minValue,this.graphBoardObject.maxValue);
    };
      
      for (var i=0; i > this.graphBoardObject.minValue; i=i-this.separation) {

        // color grid
        canvas.props.strokeStyle = this.color;
      
        if (!dragging) {
          canvas.horLineSized(i,0,this.graphBoardObject.visibleWidth()/this.graphBoardObject.xScale);
        };
        // color texto
        canvas.props.strokeStyle = '#000000';
        
        s = ''+(i.toFixed(1))+' ';
        
        canvas.drawTextRight('sans', 8, 0, i ,s);
        
        // $('evtInfo').insert('<br>i:'+i);
        
        
      };

      for (var i=0+this.separation; i < this.graphBoardObject.maxValue; i=i+this.separation) {

        // color grid
        canvas.props.strokeStyle = this.color;
        
        if (!dragging) { canvas.horLineSized(i,0,this.graphBoardObject.visibleWidth()/this.graphBoardObject.xScale);
        };
        
        // color texto
        canvas.props.strokeStyle = '#000000';
        
        s = ''+(i.toFixed(1))+' ';
        
        canvas.drawTextRight('sans', 8, 0, i ,s);
        
        // $('evtInfo').insert('<br>i:'+i);
        
        
      };
      
    },
  
});