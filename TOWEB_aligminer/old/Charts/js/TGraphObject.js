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
    
    this.offx = 0;
    this.offy = 0;
    this.xScale = 1;
    this.yScale = 1;
    
    this.graphBoardObject.addGraphObject(this);
    
  },
  
  //----------------------------------
  // determina si se puede establecer este offset X
  //----------------------------------
  canOffsetX: function(x){
    return true;
  },
  
  //----------------------------------
  // determina si se puede establecer este offset Y
  //----------------------------------
  canOffsetY: function(y){
    return true;
  },
  
  //----------------------------------
  // establece el offset X
  //----------------------------------
  setOffsetX: function(x){
    // this.offx = x;
    //     this.offy = y;
    //     
    this.offx = (x / (this.xScale));
    
    if ( this.offx  >= 0 )
            this.offx  = Math.floor( this.offx  );
    else  // es negativo
            this.offx  = Math.ceil( this.offx  );
    
  },

  //----------------------------------
  // establece el offset Y
  //----------------------------------
  setOffsetY: function(y){
    // this.offx = x;
    //     this.offy = y;
    //     
    this.offy = (y / (this.yScale));
    
    if ( this.offy  >= 0 )
            this.offy  = Math.floor( this.offy  );
    else  // es negativo
            this.offy  = Math.ceil( this.offy  );
  },
  
  //----------------------------------
  // establece la escalaX
  //----------------------------------
  setScaleX: function(x){
    this.xScale = x;
  },

  //----------------------------------
  // establece la escalaY
  //----------------------------------
  setScaleY: function(y){
    this.yScale = y;
  },
  
});