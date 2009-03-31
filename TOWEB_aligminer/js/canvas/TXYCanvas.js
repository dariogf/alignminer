//=======================================
//Clase para XYCanvas
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TXYCanvas = Class.create({

  //Constructor
  initialize: function(canvasID) {
    
    this.canvasObject = $(canvasID);

    /*
      TODO gestionar aquí el error, por ahora salir
    */
    if (!this.canvasObject.getContext) return;
    
    // obtener contexto para poder pintar
    this.canvas = this.canvasObject.getContext('2d');
    

    
    // activa el dibujado de texto
    CanvasTextFunctions.enable(this.canvas);
    
    // alias para llamadas desde fuera a propiedades
    this.props = this.canvas;
    
    this.height = this.canvasObject.height;
    this.width = this.canvasObject.width;
    
    // $('evtInfo').update('height:'+this.height);
    
    this.ox=0;
    this.oy=0;
  },

  //----------------------------------
  // lx -> transforma X en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  lx: function(x){
    // $('evtInfo').insert('<br>x:'+x+' => '+(x + this.ox));
    return (x+this.ox);
  },
  
  //----------------------------------
  // lw -> transforma w en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  lw: function(w){
    // $('evtInfo').insert('<br>w:'+w+' => '+(w));
    return (w);
  },

  //----------------------------------
  // ly -> transforma Y en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  ly: function(y){
    // $('evtInfo').insert('<br>y:'+y+' => '+(this.height - y - this.oy));
    return (this.height - y - this.oy);
    
  },
  
  //----------------------------------
  // lh -> transforma H en coordenadas 
  // cartesianas (XY) a locales (Canvas)
  //----------------------------------
  lh: function(h){
    // $('evtInfo').insert('<br>h:'+h+' => '+(- h - this.oy));
    /*
      TODO EN SAFARI NO SE PUEDEN TENER HEIGHTs NEGATIVOS
    */
    return (-h); // este es el original
    // return (h);
  },
  
  
  //----------------------------------
  // ScrollBy , hace un scroll según los parámetros indicados
  //----------------------------------
  scrollBy: function(incx,incy){
    this.ox = this.ox + incx;
    this.oy = this.oy + incy;
  },

  //----------------------------------
  // ScrollTo , hace un scroll a los parámetros indicados
  //----------------------------------
  scrollTo: function(x,y){
    this.ox = x;
    this.oy = y;
  },

  //===================================================
  // PROPIEDADES PARA PINTAR
  //===================================================


  //----------------------------------
  // fillStyle
  //----------------------------------
  fillStyle: function(){
    return this.canvas.fillStyle;
  },
  

  //===================================================
  // METODOS PARA PINTAR
  //===================================================

  //----------------------------------
  // FixNegativeParams, convierte valores w y h negativos a positivos
  // y modifica adecuadamente las variables x e y.
  //----------------------------------
  FixNegativeParams: function(x,y,w,h){
    var x1,y1,w1,h1;
    
    x1=x;
    y1=y;
    w1=w;
    h1=h;
    
    // si el ancho es negativo
    if (w<0) {
            
      x1=x+w;
      
      w1 =-w;
    } 
    
    // si el alto es negativo
    if (h<0) {
      
      y1=y+h;
      
      // cambia signo
      h1 =-h;
    };
    
    // $('evtInfo').insert('From x,y,w,h:'+x+','+y+','+w+','+h);
    //     $('evtInfo').insert('To x1,y1,w1,h1:'+x1+','+y1+','+w1+','+h1);
    
    return [x1,y1,w1,h1];
    
  },
  

  // RECTS 
  
  //----------------------------------
  // clearRect
  //----------------------------------
  clearRect: function(x,y,w,h){
    var a = this.FixNegativeParams(this.lx(x),this.ly(y),this.lw(w),this.lh(h));
    
    this.canvas.clearRect(a[0], a[1], a[2], a[3]);
  },

  //----------------------------------
  // fillRect
  //----------------------------------
  fillRect: function(x,y,w,h){
    var a = this.FixNegativeParams(this.lx(x),this.ly(y),this.lw(w),this.lh(h));
    /*
      TODO - AQUI FALLA EN FF Y SAF
    */
    this.canvas.fillRect(a[0], a[1], a[2], a[3]);
  },
  
  //----------------------------------
  // strokeRect
  //----------------------------------
  strokeRect: function(x,y,w,h){    
    var a = this.FixNegativeParams(this.lx(x),this.ly(y),this.lw(w),this.lh(h));

    this.canvas.strokeRect(a[0], a[1], a[2], a[3]);
  },
  
  // path API
  
  //----------------------------------
  // beginPath
  //----------------------------------
  beginPath: function(){
    this.canvas.beginPath();
  },
  
  //----------------------------------
  // closePath
  //----------------------------------
  closePath: function(){
    this.canvas.closePath();
  },
  
  //----------------------------------
  // moveTo
  //----------------------------------
  moveTo: function(x,y){
    this.canvas.moveTo(this.lx(x),this.ly(y));
  },
  
  //----------------------------------
  // lineTo
  //----------------------------------
  lineTo: function(x,y){
    this.canvas.lineTo(this.lx(x),this.ly(y));
  },
  
  //----------------------------------
  // rect
  //----------------------------------
  rect: function(x,y,w,h){
    var a = this.FixNegativeParams(this.lx(x),this.ly(y),this.lw(w),this.lh(h));
    
    this.canvas.rect(a[0], a[1], a[2], a[3]);
  },
  
  //----------------------------------
  // arc
  //----------------------------------
  arc: function(x,y,radius,startAngle,endAngle,anticlockwise){
    this.canvas.arc(this.lx(x),this.ly(y),this.lw(radius),startAngle,endAngle,anticlockwise);
    
  },

  //----------------------------------
  // fill
  //----------------------------------
  fill: function(){
    this.canvas.fill();
  },
  
  //----------------------------------
  // stroke
  //----------------------------------
  stroke: function(){
    this.canvas.stroke();
  },
  
  //----------------------------------
  // clip
  //----------------------------------
  clip: function(){
    this.canvas.clip();
  },

  //=======================================
  // TEXTOS (Necesita canvastext.js)
  //=======================================
  
  //----------------------------------
  // drawTextCenter
  //----------------------------------
  drawTextCenter: function(font,fontSize,x,y,text){
    this.canvas.drawTextCenter(font, fontSize, this.lx(x), this.ly(y),text);
  },
  
  //----------------------------------
  // drawTextRight
  //----------------------------------
  drawTextRight: function(font,fontSize,x,y,text){
    this.canvas.drawTextRight(font, fontSize, this.lx(x), this.ly(y),text);
  },
  
  //----------------------------------
  // drawText
  //----------------------------------
  drawText: function(font,fontSize,x,y,text){
    this.canvas.drawText(font, fontSize, this.lx(x), this.ly(y),text);
  },
  
  //----------------------------------
  // drawVerticalTextCenter
  //----------------------------------
  drawVerticalTextCenter: function(font,fontSize,x,y,text){

    var len2 = this.canvas.measureText(font,fontSize,text)/2;
    
    this.canvas.save();
    this.canvas.strokeStyle ='#000000';
    // this.canvas.translate(this.lx(x),y+len2);
    this.canvas.translate(x,y+len2);
    
    this.canvas.rotate(-90*2*3.1416/360);
    this.canvas.drawText(font, fontSize, 0, 0, text);
    this.canvas.restore();
  },
  
  
  //=======================================
  // PROPIAS
  //=======================================
  
  //----------------------------------
  // clearBackground, no le afecta escala ni scroll
  //----------------------------------
  clearBackground: function(){
    
    this.canvas.fillRect(0,0,this.width,this.height);
  },
    
  //----------------------------------
  // horLine
  //----------------------------------
  horLine: function(y){
    this.canvas.beginPath();
    
    this.canvas.moveTo(0,this.ly(y));
    this.canvas.lineTo(this.width,this.ly(y));
    
    // pinta el path
    this.canvas.stroke();
    
  },
  
  //----------------------------------
  // vertLine
  //----------------------------------
  vertLine: function(x){
    this.canvas.beginPath();
    
    this.canvas.moveTo(this.lx(x),0);
    this.canvas.lineTo(this.lx(x),this.height);
    
    // pinta el path
    this.canvas.stroke();
    
  },
  
  //----------------------------------
  // horLineSized
  //----------------------------------
  horLineSized: function(y,x1,x2){
    this.canvas.beginPath();
    
    this.canvas.moveTo(this.lx(x1),this.ly(y));
    this.canvas.lineTo(this.lx(x2),this.ly(y));
    
    // pinta el path
    this.canvas.stroke();
    
  },
  
  //----------------------------------
  // vertLineSized
  //----------------------------------
  vertLineSized: function(x,y1,y2){
    this.canvas.beginPath();
    
    this.canvas.moveTo(this.lx(x),this.ly(y1));
    this.canvas.lineTo(this.lx(x),this.ly(y2));
    
    // pinta el path
    this.canvas.stroke();
    
  },
  
});

