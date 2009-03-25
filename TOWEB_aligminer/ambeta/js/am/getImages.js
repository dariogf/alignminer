function getImg(functionName , destino, runid)
{
    // res='<div style="width: 900px; height: 440px; overflow: scroll; padding:4px; border: 1px solid black;"> <img src="tmpdata/'+id+'/graphs/'+ img +'" width="2500px" height="400px" alt="text" /></div>';

    // res = '<div style="overflow: scroll"><div style="width: 200%"><img src="tmpdata/'+id+'/graphs/'+ img +'" width="2500px" height="400px" alt="text" /></div></div>';

  var res = '<div style="width: 50px"><img src="tmpdata/'+runid+'/graphs/'+ functionName +'.png" width="2500px" height="400px" alt="text" /></div>';

    //res='<table width="100%" border="1"> <tr align=center> <td> <div style="width: 1400px; height: 400px; overflow: scroll; padding:4px; border: 1px solid black;"> <p> <img src="tmpdata/'+id+'/graphs/'+ img +'" width="2500px" height="400px" alt="text" /> </p></div></td></tr><tr></tr></table>';

	$(destino).innerHTML = res;
  
  // getRegions(functionName,destino,runid);
  
  alignment = new TAlignment('tmpdata/' + runid + '/json/alignment.json');
  
  regionsAbove = new TRegions('CONSERVATION','tmpdata/' + runid + '/json/' + functionName + '_above.json','aboveTD');
  
  regionsBelow = new TRegions('DIVERGENCE','tmpdata/' + runid + '/json/' + functionName + '_below.json','belowTD');
  
  regionsSNP = new TRegions('SNP','tmpdata/' + runid + '/json/' + functionName + '_snp.json','snpTD');

}

// function getRegions (functionName,destino,runid) {
// 
//     // pide el archivo json al servidor
//     new Ajax.Request('tmpdata/'+runid+'/json/'+functionName+'_aboveFFT.json', {
//       method:'get',
//       requestHeaders: {Accept: 'application/json'},
//       onSuccess: processRegionsAbove
//     });
//     
// }
// 
// function processRegionsAbove (obj) {
//         
//         // $('loggerDIV').innerHTML='dest:'+destino;
//    // parsea el array desde el texto json
//    
//    var regions = obj.responseText.evalJSON(true);
//    
//    var tabla = new Element('table',{border:"0", cellspacing:"0", cellpadding:"0", width:"100%"});
//    
//    var row;
//    var td;
//    
//    var a;
//      
//    // recorre el array
//    for ( var r=0, len=regions.length; r<len; r++ ){
//             row= new Element('tr');
// 
//             
//             td = new Element('td',{width:"10%"});
//             a = new Element('a',{href:"javascript:alignment.show("+regions[r].startPos+","+regions[r].endPos+");"});
//             
//             a.update(r);
//             td.appendChild(a);
//      row.appendChild(td);
//             
//             td = new Element('td',{width:"20%"});
//             td.update(regions[r].startPos);
//      row.appendChild(td);
//      
//      td = new Element('td',{width:"20%"});
//             td.update(regions[r].endPos);
//      row.appendChild(td);
//      
//      td = new Element('td',{width:"30%"});
//             td.update(regions[r].score);
//      row.appendChild(td);
//      
//      tabla.appendChild(row);
//      // res = res + "<p> endPos:" + arrayHashes[i] + "</p> ";
//    }
//    
//    // poner resultados en el div
//    $('aboveTD').update(tabla);
// }

// var header = new Element('h1', { id: 'mainTitle', lang: 'fr' }); 
// header.appendChild(document.createTextNode('La construction facile'));

// var theTable = gocument.getElementById('tableId');
// for( var x = 0; x < theTable.tHead.rows.length; x++ ) {
//   var y = document.createElement('td');
//   y.appendChild(document.createTextNode('Thead cell text'));
//   theTable.tHead.rows[x].appendChild(y);
// }
// for( var z = 0; z < theTable.tBodies.length; z++ ) {
//   for( var x = 0; x < theTable.tBodies[z].rows.length; x++ ) {
//     var y = document.createElement('td');
//     y.appendChild(document.createTextNode('Tbody cell text'));
//     theTable.tBodies[z].rows[x].appendChild(y);
//   }
// }
// for( var x = 0; x < theTable.tFoot.rows.length; x++ ) {
//   var y = document.createElement('td');
//   y.appendChild(document.createTextNode('Tfoot cell text'));
//   theTable.tFoot.rows[x].appendChild(y);
// }