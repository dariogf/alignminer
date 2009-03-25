// var LOGGER;
// var RUNID;
// var quickInfoUpdater;

// function enviaRUN () {
//      var url = '/cgi-bin/alignminer/run.cgi';
//      var pars = Form.serialize('formRUN');
//      
//      $('hitosProgreso').show();
//         
//      var myAjax = new Ajax.Request( url, {method: 'get', parameters: pars} );
//       
//       LOGGER = new PeriodicalExecuter(updateLog, 2);
//       
// }

// function startUploadFile(){
//       $('barraProgreso').show();
//       return true;
// }

// function stopUploadFile(success, id){
// 
//       if (success == 1){
//          result = '<span class="msg">The file was uploaded successfully!<\/span><br/><br/>';
//       }
//       else {
//          result = '<span class="emsg">There was an error during file upload!<\/span><br/><br/>';
//       }
//       
//       RUNID=id;
// 
//       $('FRUNID').value=RUNID;
//       
//       $('loggerDIV').innerHTML =RUNID;
//       
//       // $('barraProgreso').hide();
//       
//       quickInfoUpdater = new PeriodicalExecuter(getQuickInfo, 2);
//       // LOGGER = new PeriodicalExecuter(updateLog, 2);
//                   
//       return true;
// }

// function updateLog (pe) {
//     // pide el archivo json al servidor
//     new Ajax.Request('tmpdata/'+RUNID+'/log.txt', {
//       method:'get',
//       requestHeaders: {Accept: 'application/text'},
//       onSuccess: procesaLog
//     });
// }
// 
// function getQuickInfo (pe) {
//     // pide el archivo json al servidor
//     new Ajax.Request('tmpdata/'+RUNID+'/json/alignInfo.json', {
//       method:'get',
//       requestHeaders: {Accept: 'application/text'},
//       onSuccess: procesaQuickInfo
//     });
// }
// 
// // procesa el resultado como objeto Json
// function procesaQuickInfo (obj) {
//     
//  // parsea el texto
//  var qinfo = obj.responseText.evalJSON(true);
// 
//     // tipoFichero
//     $('fileType').innerHTML = 'File type:'+qinfo.fileType;
// 
//     // tipoSecuencia (and/protein)
//     $('sequenceType').innerHTML = 'Sequence type:'+qinfo.alphabet;
//     
//     // alineamiento
//     $('alignmentLength').innerHTML = 'Alignment length:'+qinfo.length;
//     
//     // num secuencias
//     $('numberOfSequences').innerHTML = 'Number of sequences:'+qinfo.numberOfSequences;
//     
//     // añade las secuencias
//     for (var i=0; i < qinfo.sequences.length; i++) {
//         $('sequenceList').options[i] = new Option(qinfo.sequences[i]);
//     };
//     
//     $('barraProgreso').hide();
//     $('formRunDIV').show();
// 
// 
//     // para el proceso que se baja los logger
//     quickInfoUpdater.stop();
//     
// }



// // procesa el resultado como objeto Json
// function procesaLog (obj) {
//     
//  // parsea el texto
//  var texto = obj.responseText;
// 
//     texto= convertText2HTML(texto);
// 
//     // // num secuencias
//     // grupos = texto.match(/Number of sequences found in alignment: (\d+)/);
//     // 
//     // if (grupos != null) {
//     //     $('numberOfSequences').innerHTML = 'Number of sequences:'+grupos[1];
//     // };
//     
//     var stage = 0;
//     var graphsMenu = '<td class="separadorV">&nbsp;</td>';
//     var hasADNW = 0;
//     
//     if (texto.search(/Processing alignment/g)!=-1) {
//         stage ++;
//         
//         if (texto.search(/Consensus calculated/g)!=-1) {
//             stage++;
//     
//             if (texto.search(/Calculating Function adnW/g)!=-1) {
//                 hasADNW=1;
//                 stage++;
//             };
//     
//     
//     
//             if (texto.search(/Calculating Function generalW/g)!=-1) {
//                 stage++;
//         
//                 if (hasADNW==1) {
//                     graphsMenu=graphsMenu+'<td class="textoMenu2" align="left" nowrap="nowrap"><a href="javascript:getImg(\'adnW\',\'graphDIV\',RUNID);">ADN&nbsp;|</a></td>';
//      
//                 }else{
//                     stage++;
//                 };
// 
//                 if (texto.search(/Calculating Function entropy/g)!=-1) {
//                     stage++;
//             
//                     graphsMenu=graphsMenu+'<td class="textoMenu2" align="left" nowrap="nowrap"><a href="javascript:getImg(\'generalW\',\'graphDIV\',RUNID);">GENERAL&nbsp;|</a></td>';
//             
//             
//                     if (texto.search(/The END\./g)!=-1){
//                            stage++;
//                            stage++;
//                    
//                            graphsMenu=graphsMenu+'<td class="textoMenu2" align="left" nowrap="nowrap"><a href="javascript:getImg(\'entropy\',\'graphDIV\',RUNID);">ENTROPY&nbsp;|</a></td>';
//                 
//                            texto = texto+ '<br /> LOGGER FINALIZADO.';
// 
//                            // para el proceso que se baja los logger
//                            LOGGER.stop();
//                            
//                     };
//                 };
//             };
// 
//         };        
//     };
//     
//     graphsMenu=graphsMenu+'<td width="100%"></td>';
//     
//     $('menu2').innerHTML=graphsMenu;
//     // texto = texto+ '<br /> Stage:'+ stage;
//     
//     $('hitosProgreso').innerHTML = "<img src=\"images/stage"+stage+".png\" alt=\"\"/><br /><img src=\"images/stagesText.png\" alt=\"\"/>";
//  
//     // $('loggerDIV').innerHTML = texto;    
// }

// convierte los lineBreaks del texto a HTML
// function convertText2HTML(itexto){
// 
//     var lineBreak = '<br />';
// 
//     var texto = itexto;
// 
//     texto = texto.replace(/\r\n/g,lineBreak);
//     texto = texto.replace(/\n/g,lineBreak);
//     texto = texto.replace(/\r/g,lineBreak);
// 
//     return texto;
// }
