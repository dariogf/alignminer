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
    this.canvas = new TScaleXYCanvas(canvasID);
    
    // this.canvasObject.getContext('2d');
    
    this.xGridObject = null;
    this.yGridObject = null;
    
    this.maxValue = null;
    this.minValue = null;
    
    this.dataLength = 0;
    
    this.leftMargin=40;
    this.bottomMargin=40;
    this.leftCellWidth = 11;
    
    this.graphs = new Array();
    
    // inicio y fin del taco 
    this.initScrollThumb = 0;
    this.endScrollThumb = 0;
    
    this.pageScroll = 10;
    
    
    // posicion primer click del arrastre
    this.firstx = 0;
    this.firsty = 0;
    
    this.oneClick = null;
    
    this.sx = 0;
    this.sy = 0;
    
    this.xScale = 2;
    this.yScale = 1;
    
    this.xScroll = 0;
    
    this.selection1 = -1;
    this.selection2 = -1;
    
    this.dragging = false;

    // this.addEvents();

    // $('evtInfo').update('w:'+this.canvasObject.width);
    
  },  
  
  //----------------------------------
  // getXGridForScale
  //----------------------------------
  getXGridForScale: function(scale){
    
    var sep = 1600;

    if (this.xScale>=0.125) {
      sep = 800;
    };
    
    if (this.xScale>=0.25) {
      sep = 400;
    };    

    if (this.xScale>=0.5) {
      sep = 200;
    };    
    
    if (this.xScale>=1) {
      sep = 100;
    };

    if (this.xScale>=2) {
      sep = 50;
    };

    if (this.xScale>=4) {
      sep = 25;
    };

    if (this.xScale>=8) {
      sep = 20;
    };
    
    if (this.xScale>=16) {
      sep = 10;
    };
    
    return sep;
  },
  
  
  //----------------------------------
  // refreshScale
  //----------------------------------
  refreshScale: function(){
    // establece escalas:
    //alert(this.getMax());
    //incr=this.getMax()-this.getMin();
    incr = 0;
    
    // TODO: CHECK MARGENES CON PORCENTAJE ALTURA

    this.maxValue = this.getMax()+incr;
    this.minValue = this.getMin()+incr;
    this.dataLength = this.getDataLength();
    
    
    // this.yScale = Math.round((-this.bottomMargin+this.height())/((this.maxValue-this.minValue)));
    this.yScale = ((-this.bottomMargin+this.height())/((this.maxValue-this.minValue)));
    
    $('evtInfo').insert('<br>min,max,ysca:'+this.bottomMargin+','+this.height()+','+this.yScale);

    this.xGridObject.separation = this.getXGridForScale(this.xScale);
    
    // 
    // $('evtInfo').update('sca:'+this.minValue+','+this.maxValue+','+scaY);
    //
    
    // Escalado
    this.canvas.scaleTo(this.xScale,this.yScale);
    
    //centrado vertical
    this.canvas.scrollTo(this.leftMargin, -this.minValue*this.yScale+this.bottomMargin);
    
    // el salto de página es un bloque completo.
    this.pageScroll = (this.visibleWidth() / this.xScale)-10;
    
  },
  
  //----------------------------------
  // visibleWidth
  //----------------------------------
  visibleWidth: function(){
    return this.canvasObject.width-this.leftMargin;
  },
  
  
  //----------------------------------
  // visibleHeight
  //----------------------------------
  visibleHeight: function(){
    return this.canvasObject.height-this.bottomMargin;
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

    this.refreshScale();
  },
  
  //----------------------------------
  // responde evento mousedown
  //----------------------------------
  onCanvasMousedown: function(event){
    var x = event.pointerX();
    // var y = event.pointerY();
    var y = event.clientY;
      // var t = $('idCanvas').viewportOffset();
    var t = this.canvasObject.viewportOffset();
      // $('evtInfo').update('y:'+y+'top:'+t.top);

    y=y-t.top;
    
    
    this.firstx = x;
    this.firsty=y;

    // estamos arrastrando
    this.dragging=true;

    // anota posicion primer click
    this.sx=x;
    this.sy=y;

    this.canvasObject.observe('mousemove',this.onCanvasMousemove.bindAsEventListener(this));
    
  },
  
  //----------------------------------
  // responde evento mouseup
  //----------------------------------
  onCanvasMouseup: function(event){
    var x = event.pointerX();
    // var y = event.pointerY();
    var y = event.clientY;
    // var t = $('idCanvas').viewportOffset();
    var t = this.canvasObject.viewportOffset();
    // $('evtInfo').update('y:'+y+'top:'+t.top);
    
    y=y-t.top;
    
 

    this.dragging=false;

    this.canvasObject.stopObserving('mousemove',this.onCanvasMousemove.bindAsEventListener(this));
    
    if ((this.firstx==x) & (this.firsty==y)) {
    
      // comprobar si es en la barra de scroll
      if (y>(this.height()-this.bottomMargin)){
          
           x=(x-t.left)/this.xScale;          
           
           if ((x)<this.initScrollThumb+this.leftMargin/this.xScale) { // click a la izquierda
                     // $('evtInfo').update('click en scroll izquierda');
                     this.scrollXBy(this.pageScroll*this.xScale);
                     this.paint(false);
           }else if ((x)>this.endScrollThumb+this.leftMargin/this.xScale){// click a la derecha
                     // $('evtInfo').update('click en scroll derecha');
                     this.scrollXBy(-this.pageScroll*this.xScale);
                     this.paint(false);
                     
           }else{ // click dentro
             // $('evtInfo').update('click en scroll centro');
           };
          
      }else{
        x=(x-t.left);
        
        // $('evtInfo').update('click en grafica');
        if (this.oneClick!=null) {
         // this.oneClick(Math.round((-this.xScroll-this.leftMargin-this.leftCellWidth+x)/this.xScale));
        this.oneClick(Math.round((-this.xScroll-this.leftMargin+x)/this.xScale));
        };
        
      };
      // this.fire('graphBoard:oneclick');
      
    };
    
    this.paint(false);
  },
  
  //----------------------------------
  // responde al evento mouseout
  //----------------------------------
  onCanvasMouseout: function(event){

    if (this.dragging) {
      this.dragging = false;

  this.canvasObject.stopObserving('mousemove',this.onCanvasMousemove.bind(this));
    
      this.paint(false);
    };
  },
  
  
  //----------------------------------
  // responde mouseMove
  //----------------------------------
  onCanvasMousemove: function(event){

    if (event.isLeftClick()) {

      if (this.dragging) {
          var x = event.pointerX();
          // var y = event.pointerY();
          var y = event.clientY;
          // var t = $('idCanvas').viewportOffset();
          var t = this.canvasObject.viewportOffset();
          // $('evtInfo').update('y:'+y+'top:'+t.top);
          
          y=y-t.top;
              
          var nx=0,ny=0;

             // Distancia que se ha movido el ratón desde el último mousemove             
             nx=(x-this.sx);
             ny=(y-this.sy);
             
             // ajustar lo que ya se ha incrementado
            if (nx != 0) {
              
              //comprobar si todos se pueden añadir al offset
              var oldScroll = this.xScroll;
              
                
                if (y>this.height()-this.bottomMargin){
                  // $('evtInfo').update('nx:'+nx);
                  nx=-nx*((this.dataLength*this.xScale)/this.visibleWidth());
                }
                
                this.scrollXBy(nx);
                
                // $('evtInfo').update('pos1:'+this.getXStartPos()+', pos2:'+this.getXEndPos()+', de:'+this.dataLength);
                
                
                // anotar la nueva posición inicial
                this.sx = x;
                this.sy = y;
                
                if (oldScroll != this.xScroll) {
                  // repintar todo
                  this.paint(true);
                };
            }
      }

    }
  },
  
  //----------------------------------
  // scaleXTo
  //----------------------------------
  scaleXTo: function(s,painting){
    if (s>=0) {
        this.xScale=s;
        
        this.refreshScale();
        
        if (painting) {
          this.paint(false);
        };

    };
  },
  
  //----------------------------------
  // maxIncLeft
  //----------------------------------
  maxIncLeft: function(incx){
    var nx=incx;
    
    if ((this.xScroll+nx)>0){ // nos pasamos, restringir:
        if (this.xScroll>0) {
            nx = 0;
        }else{
          nx = -this.xScroll;
        };
    };
    return nx;
  },
  
  //----------------------------------
  // maxIncRight
  //----------------------------------
  maxIncRight: function(incx){
    var nx=incx;
    
    // incremento máximo admitido
    var maxinc = (this.dataLength*this.xScale)+this.xScroll-this.visibleWidth();
    if (-nx>maxinc) {
      if (maxinc>0) {
        nx=-maxinc;
      }else{
        nx=0;
      };
    };
    
    return nx;
  },
  
  
  
  //----------------------------------
  // scrollXBy
  //----------------------------------
  scrollXBy: function(incx){
    var nx = incx;
    
    // comprobar por la izquierda
    if (nx>0) {
      nx=this.maxIncLeft(nx);
    };
    
    // comprobar por la derecha
    if (nx<0) {
      nx=this.maxIncRight(nx);
    };

    // 
    // $('evtInfo').update('Scr:'+this.xScroll+',nx:'+nx+',npos:'+npos+',maxinc:'+maxinc);

    // $('evtInfo').update('Scr:'+this.xScroll+',nx:'+nx+',maxinc:'+maxinc);
    
    
    if (nx!=0){
      for (var i=0; i < this.graphs.length; i++) {
         this.graphs[i].setScrollXBy(nx);
      };
      this.xScroll += nx;
    };
    
    
  },
  
  //----------------------------------
  // scrollXTo
  //----------------------------------
  scrollXTo: function(x){
    
    var nx=0;
    
    // comprobar por la izquierda
    if (x>=0) {
      nx=this.maxIncLeft(x-this.xScroll);
      // $('evtInfo').update('<br>izq, x:'+x+',nx:'+nx+',xscroll:'+this.xScroll);
    };
    
    // comprobar por la derecha
    if (x<0) {
      nx=this.maxIncRight(x-this.xScroll);
      // $('evtInfo').update('<br>derecha, x:'+x+',nx:'+nx+',xscroll:'+this.xScroll);
    };
    
    nx=nx+this.xScroll;
    
    // 
    // $('evtInfo').update('Scr:'+this.xScroll+',nx:'+nx+',npos:'+npos+',maxinc:'+maxinc);

    // $('evtInfo').update('Scr:'+this.xScroll+',nx:'+nx+',maxinc:'+maxinc);
    
    if (nx!=this.xScroll){
      for (var i=0; i < this.graphs.length; i++) {
         this.graphs[i].setScrollX(nx);
      };
    
      this.xScroll = nx;
    }
  },
  
  //----------------------------------
  // getXStartPos
  //----------------------------------
  getXStartPos: function(){
    // return Math.round(-this.graphs[0].xScroll/this.xScale);
    return Math.round(-this.xScroll/this.xScale);
  },
  
  //----------------------------------
  // getXEndPos
  //----------------------------------
  getXEndPos: function(){
    // return Math.round((-this.graphs[0].xScroll+this.visibleWidth())/this.xScale);
    return Math.round((-this.xScroll+this.visibleWidth())/this.xScale);
  },
  
  //----------------------------------
  // pinta todo
  //----------------------------------
  paint: function(dragging){
    this.paintBackground(dragging);
    this.paintGraphs(dragging);
    // $('evtInfo').insert('<br>min,max:'+this.minValue+','+this.maxValue);
  },
  
  //----------------------------------
  // Pinta el fondo
  //----------------------------------
  paintBackground: function(dragging){
    var n, x, y;


    // limpia el fondo con blanco
    this.canvas.props.fillStyle='#FFFFFF'; //Color de relleno

    this.canvas.clearBackground();

    // pinta el fondo de la gráfica    
    // this.canvas.props.fillStyle='#FAFFEE'; //Color de relleno
    
    this.canvas.props.fillStyle='#FFF5EB'; //Color de relleno
    this.canvas.fillRect(0, this.minValue, this.visibleWidth()/this.xScale, this.maxValue-this.minValue); //Rellena el fondo
    
    
    // pinta trozo de gráfica seleccionado
    /*
      TODO -ojo que está pintando la señal un punto a la derecha o algo así.
    */
    if ((this.selection1!=-1) & (this.selection2!=-1)) {
      var s1=Math.round(this.selection1+this.xScroll/this.xScale);
      var s2=this.selection2-this.selection1;
      
      if (this.selection2==this.selection1) {
        s2=1;
      };
      
      if (s1<0) {
        s2 = s2+s1;
        s1 = 0;
      };
      
      if (s2<0) {
        s2 = s1;
      };

      if ((s1>=0) & (s2>=0)) {
        // this.canvas.props.fillStyle='#E0DFE2'; //Color de relleno
        this.canvas.props.fillStyle='#BFFF98';
        if (s2==1) {
          s1--;
          s2++;
          // this.canvas.props.fillStyle='#000000'; //Color de relleno
        };
        this.canvas.fillRect(s1, this.minValue,s2, this.maxValue-this.minValue);
         //Rellena el fondo
       };
    };
    
    // pinta la barra scroll
    this.canvas.props.strokeStyle = '#494B51';
    
    this.canvas.strokeRect(0, this.minValue-((this.bottomMargin/this.yScale)/2),  this.visibleWidth()/this.xScale,-((this.bottomMargin/this.yScale))/2); //Rellena el fondo

    this.canvas.props.fillStyle='#273151'; //Color de relleno

    this.initScrollThumb = (this.visibleWidth()*this.getXStartPos()/this.xScale)/this.dataLength;
    
    this.endScrollThumb = (this.visibleWidth()*this.getXEndPos()/this.xScale)/this.dataLength;
    
    this.canvas.fillRect(this.initScrollThumb, this.minValue-((this.bottomMargin/this.yScale)/2),  this.endScrollThumb-this.initScrollThumb, -((this.bottomMargin/this.yScale))/2); //Rellena el fondo
    
    // $('evtInfo').insert('<br>px1:'+px1+'px2:'+px2);
    // this.canvas.fillRect(this.leftMargin/this.xScale,this.bottomMargin/this.xScale, this.visibleWidth()/this.xScale, this.minValue); //Rellena el fondo
    
  },
  
  //----------------------------------
  // pinta la gráfica
  //----------------------------------
  paintGraphs: function(dragging){
    
    for (var i=0; i < this.graphs.length; i++) {
      this.graphs[i].paint(this.canvas,dragging);
    };
    
  },
  
  //----------------------------------
  // selectRange
  //----------------------------------
  selectRange: function(from,to){
    this.selection1 = from;
    this.selection2 = to;
  },
  
  //----------------------------------
  // emptyRange
  //----------------------------------
  emptyRange: function(){
    this.selection1 = -1;
    this.selection2 = -1;
  },
  
  
  //----------------------------------
  // centerGraphsAt
  //----------------------------------
  centerGraphsAt: function(from,to,position,selectInGraph,painting){
    var step = 0;
    
    // position es 
    // -1 => izquierda => 0;
    // 0 => centro => + width/2
    // 1 => derecha => + width;
    // 
    
    
    // this.scrollXTo(-(i*this.xScale)+(this.width()/2));
    
    step = 0.5*this.visibleWidth()*(position+1);

    this.scrollXTo(-(from*this.xScale)+step);
   
    this.emptyRange();
    
    if (selectInGraph) {
      this.selectRange(from,to);
    };
    
    if (painting) {
      this.paint(false);
    };
    
  },
  
  //----------------------------------
  // obtiene el minimo de todas las gráficas
  //----------------------------------
  getMin: function(){
    // var m = 0;
    
    var a = new Array();
    
    for (var i=0; i < this.graphs.length; i++) {
      // m= Math.min(m,this.graphs[i].minValue);
      // if (m>this.graphs[i].minValue)
      a.push(this.graphs[i].minValue);
    };
    
    //alert(a.min()); 
    return (a.min());
    
    // return m;
  },
  
  //----------------------------------
  // obtiene el maximo de todas las gráficas
  //----------------------------------
  getMax: function(){
    var a = new Array();
    
    for (var i=0; i < this.graphs.length; i++) {
      a.push(this.graphs[i].maxValue);
    };
    return (a.max());
    // return m;
  },

  //----------------------------------
  // obtiene el maximo de longitud de datos
  //----------------------------------
  getDataLength: function(){
    var a = new Array();
    
    for (var i=0; i < this.graphs.length; i++) {
      a.push(this.graphs[i].dataLength);
    };
    
    return (a.max());
  },
  
  //----------------------------------
  // removeEvents
  //----------------------------------
  removeEvents: function(){
    
    this.canvasObject.stopObserving();    
  },
  
  //----------------------------------
  // addEvents
  //----------------------------------
  addEvents: function(){
    // evento mousedown
    this.canvasObject.observe('mousedown',this.onCanvasMousedown.bindAsEventListener(this));
    
    // evento mouseup
    this.canvasObject.observe('mouseup',this.onCanvasMouseup.bindAsEventListener(this));
    
    // evento mouseout
    this.canvasObject.observe('mouseout',this.onCanvasMouseout.bindAsEventListener(this));
    
  },

  
});
