//=======================================
//Clase para pintar el eje X
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TXGrid = Class.create(TGraphObject, {

  //Constructor
  initialize: function($super,graphBoardObject,color,separation) {
    
    this.separation = separation;
    
    graphBoardObject.xGridObject = this;
    
    $super(graphBoardObject,color);
    
  },
  
  //----------------------------------
  // pintar
  //----------------------------------
  paint: function(canvas,dragging){
    
      canvas.props.lineWidth = 1/2;
      
      // canvas.beginPath();

      var p = (-1)*Math.round(this.xScroll / canvas.xScale);
      
      
      
      var ini=0;
      
      if (p<0) {
        ini=-p;
      }
      
      // limite de dibujado
      var fin = Math.floor(canvas.width / canvas.xScale);

      
      // $('evtInfo').update('<br>p,ini,fin:'+p+','+ini+','+fin);
      
      // var ni=0;
      var s='';
      
      canvas.props.strokeStyle = '#000000';
      
      
      // canvas.drawTextCenter('sans', 10, (this.graphBoardObject.visibleWidth()/2)/this.graphBoardObject.xScale, this.graphBoardObject.minValue-2.1,"Position");
      
     if (!dragging) {
       canvas.horLineSized(this.graphBoardObject.minValue, 0, this.graphBoardObject.visibleWidth()/this.graphBoardObject.xScale);
    };
      
      for (var i=ini; i < fin; i=i+1) {
                        
            if (!((i+p) % this.separation)) {
              
              // color grid
              canvas.props.strokeStyle = this.color;

              if (!dragging) {
                canvas.vertLineSized(i, this.graphBoardObject.minValue, this.graphBoardObject.maxValue);
              };
              
              // color texto
              canvas.props.strokeStyle = '#000000';
              
              s = ''+(i+p)+'';
              
              canvas.drawTextCenter('sans', 8, i, this.graphBoardObject.minValue-(12/this.graphBoardObject.yScale),s);
              
              // $('evtInfo').insert('<br>i:'+i);
              
              // ni++;
            };
            
      };

      // $('evtInfo').insert('<br>total i:'+ni);
      
      // pinta el path
      // canvas.stroke();

    },
  
});