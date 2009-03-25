var incx=0,incy=0;
var sx,sy;
var x,y;

var pos;

var offx=0, offy=0;

var arrastrando;

var nx,ny;

var finalX,finalY;

var multiX = 1;

function onIdCanvasMousedown (event) {
  x = event.pointerX();
  y = event.pointerY();
  
  arrastrando=true;
  
  incx=0;
  incy=0;
  
  sx=x;
  sy=y;
  
  $('evtInfo').update('down:' + sx + ',' + sy);
  
  $('idCanvas').observe('mousemove',onIdCanvasMousemove);
}

function onIdCanvasMouseup (event) {
  x = event.pointerX();
  y = event.pointerY();

  arrastrando=false;
  
  // scrollX = scrollX - (finalX-initialX);
  // $('evtInfo').insert(' incx:'+incx);
  // $('evtInfo').update('dif:' + scrollX);

  // paint();
  
  $('idCanvas').stopObserving('mousemove',onIdCanvasMousemove);
}

function onIdCanvasMousemove (event) {
  x = event.pointerX();
  y = event.pointerY();

  if (event.isLeftClick()) {

    if (arrastrando) {
        
         // // Distancia que se ha movido el ratón desde el último mousemove
         // nx=(x-sx-incx);
         // ny=(y-sy-incy);
         // 
         // // ajustar lo que ya se ha incrementado
         // 
         // // if ((nx -incx) != incx) {
         //   incx = nx+incx; // lleva incx
         //   incy = ny+incy;
         
           // Distancia que se ha movido el ratón desde el último mousemove
           nx=(x-sx-incx);
           ny=(y-sy-incy);

           // ajustar lo que ya se ha incrementado

           // if ((nx -incx) != incx) {
          offx = nx + offx; // lleva incx
          offy = ny + offy;
         
          paint();
         // }
    }
    
    $('evtInfo').insert(' incx:'+offx);
    
    // scrollX = scrollX - (event.pointerX()-initialX);
    // $('evtInfo').insert(' scroll:'+incx);
    
  };
  
}

function init () {
  $('idCanvas').observe('mousedown',onIdCanvasMousedown);
  $('idCanvas').observe('mouseup',onIdCanvasMouseup);
}


function paint () {

  var n, x, y, canvas;
 
  //ver http://developer.mozilla.org/en/docs/HTML:Canvas
  canvas = $('idCanvas').getContext('2d');
 
  canvas.fillStyle='#FFFFFF'; //Color de relleno
  canvas.fillRect(0,0,900,200); //Rellena el fondo
 
  //Pintamos el área de la gráfica
  canvas.fillStyle ='#404040';
 
  // canvas.strokeStyle = "rgba(255,255,0,0.2)";
  canvas.strokeStyle = "rgb(255,0,0)";

  canvas.moveTo(0,data[0]); 
 
  canvas.beginPath();
 
  pos = Math.round( offx / multiX);
  
  // pos.toFixed(0);
 
  for (var i=1; i < 900; i++) {
    canvas.lineTo((i*multiX),data[i-pos]*100);
  };
 
  // canvas.closePath();
  canvas.stroke();

  canvas.strokeStyle = "rgba(255,255,0,0.2)";
  canvas.beginPath();
  canvas.moveTo(0,100);
  canvas.lineTo(1000,100);
  canvas.stroke();
  
  canvas.beginPath();
  canvas.moveTo(0,0); 
  for (var i=0; i < data.length; i=i+100) {
    canvas.strokeRect(i*multiX,0,1,200);
  };
  
  // canvas.closePath();
 canvas.stroke();
  
  // //Ahora pintamos unas rayitas y los puntos de los datos
  // canvas.strokeStyle = "rgba(255,255,255,0.2)"; //gris semi transparente. Para rayitas
  // canvas.fillStyle = "rgba(0,0,0,1.0)"; //negro opaco, para circulitos.
  // 
  // for (n=0; n<10; n++) {
  //  x=n*100; y=200-$("dato"+n).value;
  //  
  //  canvas.strokeRect(x,0,1,200);//Rayitas
  //  
  //  canvas.beginPath();   //Circulitos
  //  canvas.arc(x, y, 2.5, 0, kDosPi, 1);
  //  canvas.closePath();
  //  canvas.fill();
  // };
};

