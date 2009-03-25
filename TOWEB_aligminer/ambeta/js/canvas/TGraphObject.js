//=======================================
//Clase para interfaz objetos de gráficas
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TGraphObject = Class.create({
  
  //Constructor
  initialize: function(graphBoardObject,color) {
    
    this.color = color;
    
    this.graphBoardObject = graphBoardObject;
    
    this.graphBoardObject.addGraphObject(this);
    
    this.xScroll = 0;
    
    // this.dataLength = 0;
    
    // this.minValue=0;
    //     this.maxValue=0;
    //     
  },
  
  //----------------------------------
  // determina si se puede establecer este Scroll X
  //----------------------------------
  canScrollX: function(x){
    return true;
  },
  
  //----------------------------------
  // establece el Scroll X
  //----------------------------------
  setScrollX: function(x){
    
    this.xScroll = x;
    
  },

  //----------------------------------
  // establece el Scroll X
  //----------------------------------
  setScrollXBy: function(incx){
    
    this.xScroll = this.xScroll + incx;
    
  },
  
  
});