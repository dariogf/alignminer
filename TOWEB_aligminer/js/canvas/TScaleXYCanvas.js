//=======================================
//Clase para TScaleXYCanvas
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TScaleXYCanvas = Class.create( TXYCanvas, {

  //Constructor
  initialize: function($super,canvasID) {

    $super(canvasID);
    
    this.xScale = 1;
    this.yScale = 1;
  },
  
  //----------------------------------
  // scaleBy
  //----------------------------------
  scaleBy: function(incx,incy){
    this.xScale=this.xScale+incx;
    this.yScale=this.yScale+incy;
  },
  
  //----------------------------------
  // scaleTo
  //----------------------------------
  scaleTo: function(x,y){
    this.xScale=x;
    this.yScale=y;
  },
  
  // ESTO NO ES NECESARIO PORQUE ox y oy se guardan en pixeles directamente.
  // //----------------------------------
  // // ScrollBy , hace un scroll según los parámetros indicados
  // //----------------------------------
  // scrollBy: function($super,incx,incy){
  //   
  //   $super(incx / this.xScale,incy / this.yScale);
  // },
  // 
  // //----------------------------------
  // // ScrollTo , hace un scroll a los parámetros indicados
  // //----------------------------------
  // scrollTo: function($super,x,y){
  // 
  // 
  //   $super(x / this.xScale,y / this.yScale);
  // },
  
  //----------------------------------
  // lx -> transforma X en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  lx: function($super,x){

    return ($super(this.xScale*x));
  },
  
  //----------------------------------
  // lw -> transforma w en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  lw: function($super,w){

    return ($super(this.xScale*w));
  },

  //----------------------------------
  // ly -> transforma Y en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  ly: function($super,y){

    return ($super(this.yScale*y));
    
  },
  
  //----------------------------------
  // lh -> transforma H en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  lh: function($super,h){
    return ($super(this.yScale*h));
    
  },
  
  

});