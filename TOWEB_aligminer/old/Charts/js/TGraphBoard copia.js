//=======================================
//Clase para gestionar el pintado de gráficas
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TGraphBoard = Class.create({

  //Constructor
  initialize: function(canvasID) {

    this.canvasObject = $(canvasID);

    // obtener contexto para poder pintar
    this.canvas = this.canvasObject.getContext('2d');
    
    this.incx = 0;
    this.incy = 0;
    this.sx = 0;
    this.sy = 0;
    
    this.offx = 0;
    this.offy = 0;
    
    this.xScale = 4;
    
    this.dragging = false;
    
    // evento mousedown
    this.canvasObject.observe('mousedown',this.onCanvasMousedown.bind(this));
    
    // evento mouse up
    this.canvasObject.observe('mouseup',this.onCanvasMouseup.bind(this));
    
    
    // pintar
    this.paint();
  },
  
  //----------------------------------
  // responde evento mousedown
  //----------------------------------
  onCanvasMousedown: function(event){
    var x = event.pointerX();
    var y = event.pointerY();

    this.dragging=true;

    this.incx=0;
    this.incy=0;

    this.sx=x;
    this.sy=y;

    // $('evtInfo').update('down:' + sx + ',' + sy);
    this.canvasObject.observe('mousemove',this.onCanvasMousemove.bind(this));
    
  },
  
  //----------------------------------
  // responde evento mouseup
  //----------------------------------
  onCanvasMouseup: function(event){
    var x = event.pointerX();
    var y = event.pointerY();

    this.dragging=false;

    this.canvasObject.stopObserving('mousemove',this.onCanvasMousemove.bind(this));
  },
  
  //----------------------------------
  // responde mouseMove
  //----------------------------------
  onCanvasMousemove: function(event){

    if (event.isLeftClick()) {

      if (this.dragging) {
          var x = event.pointerX();
          var y = event.pointerY();
          var nx=0,ny=0;

             // Distancia que se ha movido el ratón desde el último mousemove
             nx=(x-this.sx-this.incx);
             ny=(y-this.sy-this.incy);

             // ajustar lo que ya se ha incrementado

             // if ((nx -incx) != incx) {
            this.incx = nx + this.incx; // lleva incx
            this.incy = ny + this.incy;
            
            this.offx = this.offx + nx;
            this.offy = this.offy + ny;

            this.paint();
            
           // }
      }

      // $('evtInfo').insert(' incx:'+this.offx);

      // scrollX = scrollX - (event.pointerX()-initialX);
      // $('evtInfo').insert(' scroll:'+incx);
    }
  },
  
  
  //----------------------------------
  // pinta todo
  //----------------------------------
  paint: function(){
    //     this.canvas.fillStyle='#808080'; //Color de relleno
    // this.canvas.fillRect(0,0,900,200); //Rellena el fondo
    
    this.paintBackground();
    this.paintGraphs();
  },
  

  //----------------------------------
  // Pinta el fondo
  //----------------------------------
  paintBackground: function(){
     var n, x, y;

     this.canvas.fillStyle='#ABF0FB'; //Color de relleno
     this.canvas.fillRect(0,0,900,200); //Rellena el fondo

     this.canvas.beginPath();
     this.canvas.moveTo(0,0); 
     for (var i=0; i < 900; i=i+100) {
       this.canvas.strokeRect(i*(this.xScale),0,1,200);
     };

     // canvas.closePath();
    this.canvas.stroke();

    
  },
  
  //----------------------------------
  // pinta la gráfica
  //----------------------------------
  paintGraphs: function(){
    var pos;
    
    // canvas.strokeStyle = "rgba(255,255,0,0.2)";
    this.canvas.strokeStyle = "rgb(255,0,0)";
    
    pos = Math.round(this.offx / (this.xScale));
    
    //this.canvas.moveTo(0,0);
    this.canvas.moveTo(0,data[0-pos]);
    
    this.canvas.beginPath();    
    
    this.canvas.moveTo(0,data[0-pos]);
    
    // pos = this.offx;
        
    for (var i=1; i < 900; i++) {
      this.canvas.lineTo((i*(this.xScale)),data[i-pos]*100);
    };
    
    // canvas.closePath();
    this.canvas.stroke();
    
  }
  

});