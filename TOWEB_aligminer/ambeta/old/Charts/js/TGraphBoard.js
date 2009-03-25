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
    
    this.graphs = new Array();
    
    this.sx = 0;
    this.sy = 0;
    
    this.offx = 0;
    this.offy = 0;
    
    this.xScale = 4;
    
    this.dragging = false;
    
    
    // evento mousedown
    this.canvasObject.observe('mousedown',this.onCanvasMousedown.bind(this));
    
    // evento mouseup
    this.canvasObject.observe('mouseup',this.onCanvasMouseup.bind(this));
    
    // evento mouseout
    this.canvasObject.observe('mouseout',this.onCanvasMouseout.bind(this));
    
    // $('evtInfo').update('w:'+this.canvasObject.width);
    
  },
  
  //----------------------------------
  // ancho
  //----------------------------------
  width: function(){
    return this.canvasObject.width;
  },
  
  //----------------------------------
  // alto
  //----------------------------------
  height: function(){
    return this.canvasObject.height;
  },
  
  //----------------------------------
  // Añade una grafica
  //----------------------------------
  addGraphObject: function(graph){
    this.graphs.push(graph);
  },
  
  //----------------------------------
  // responde evento mousedown
  //----------------------------------
  onCanvasMousedown: function(event){
    var x = event.pointerX();
    var y = event.pointerY();

    // estamos arrastrando
    this.dragging=true;

    // anota posicion primer click
    this.sx=x;
    this.sy=y;

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
  // responde al evento mouseout
  //----------------------------------
  onCanvasMouseout: function(event){

    this.dragging = false;

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
             nx=(x-this.sx);
             ny=(y-this.sy);
             
             // ajustar lo que ya se ha incrementado
            if (nx != 0) {
              
              //comprobar si todos se pueden añadir al offset
              var res = true;
              
              for (var i=0; i < this.graphs.length; i++) {
                res = res & this.graphs[i].canOffsetX(this.offx+nx);
                // res = res & this.graphs[i].canOffsetY(this.offy+ny);
              };
              
              if (res) {
              
                // modificar los offset
                this.offx = this.offx + nx;
                this.offy = this.offy + ny;
                
                for (var i=0; i < this.graphs.length; i++) {
                  this.graphs[i].setOffsetX(this.offx);
                  // this.graphs[i].setOffsetY(this.offy);
                };
              };

                // anotar la nueva posición inicial
                this.sx = x;
                this.sy = y;
              
              // repintar todo
              this.paint();
            }
      }

    }
  },
  
  
  //----------------------------------
  // pinta todo
  //----------------------------------
  paint: function(){
    this.paintBackground();
    this.paintGraphs();
  },
  

  //----------------------------------
  // Pinta el fondo
  //----------------------------------
  paintBackground: function(){
     var n, x, y;

     this.canvas.fillStyle='#FAFFEE'; //Color de relleno
     this.canvas.fillRect(0,0,900,200); //Rellena el fondo

    // this.canvas.beginPath();     
    //  this.canvas.moveTo(0,0); 
    //  
    //  var le = Math.floor(this.canvas.width/this.xScale);
    //  
    //  for (var i=0; i < le; i=i+100) {
    //    this.canvas.strokeRect(i*(this.xScale),0,1,200);
    //  };
    // 
    //  // canvas.closePath();
    // this.canvas.stroke();

    
  },
  
  //----------------------------------
  // pinta la gráfica
  //----------------------------------
  paintGraphs: function(){
    
    for (var i=0; i < this.graphs.length; i++) {
      this.graphs[i].paint(this.canvas);
    };
    
    // var pos;
    //     
    //     // canvas.strokeStyle = "rgba(255,255,0,0.2)";
    //     this.canvas.strokeStyle = '#000000';
    //     
    //     pos = (this.offx / (this.xScale));
    //     
    //     if ( pos >= 0 )
    //             pos = Math.floor( pos );
    //     else  // es negativo
    //             pos = Math.ceil( pos );
    //     
    //     // this.canvas.moveTo(0,0);
    //     // this.canvas.moveTo(0,data[0-pos]);
    //     
    //     this.canvas.beginPath();
    //     
    //     this.canvas.moveTo(0,data[0-pos]);
    //     
    //     // limite de dibujado
    //     var le = Math.floor(900/this.xScale);
    //     
    //     for (var i=1; i < le; i++) {
    //       this.canvas.lineTo((i*(this.xScale)),data[i-pos]*100);
    //     };
    //     
    //     // pinta el path
    //     this.canvas.stroke();
    //     
  }
  

});