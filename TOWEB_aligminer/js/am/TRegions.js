//=======================================
//Clase para Gestionar regiones
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

// 'tmpdata/'+runid+'/json/'+functionName+'_aboveFFT.json'

var TRegions = Class.create({
  //----------------------------------
  // Constructor
  //----------------------------------
  initialize: function(title,runid,graphName,type,destination,loadDone,emptyMsg,forceEmpty) {
    
    this.title = title;
    this.runid = runid;
    this.graphName=graphName;
    this.type=type;
    this.destination = destination;
    this.regions = null;
    this.destination = destination;
    this.emptyMsg = emptyMsg;
    
    this.currentPage=0;
    this.pageSize=25;
    
    this.ascendentSort = true;
    this.currentSortElement = null;
    
    this.loadDone=loadDone;

    if (forceEmpty) {
      // regiones vacías
      this.regions = [];

  		this.numberRegions();

  		if (this.loadDone!=null) {
  		  this.loadDone();
  		};
  		
    }else{
      this.getRegion();      
    };

  },
  
  //----------------------------------
  // Obtiene los datos de la región
  //----------------------------------
  getRegion: function(){
    
    // pide el archivo json al servidor
    new Ajax.Request(cgiPath+'download.cgi?F='+this.regionsDataURL(), {
      method:'get',
      requestHeaders: {Accept: 'application/json'},
      onSuccess: this.processDownloadedRegions.bind(this)
    });
  },
  
  //----------------------------------
  // Obtiene la url de los datos
  //----------------------------------
  regionsDataURL: function(){
    return this.runid + '/json/' + this.graphName + '_'+this.type+'.json';
  },
  
  //----------------------------------
  // Procesa las regiones descargadas
  //----------------------------------
  processDownloadedRegions: function(obj){
    
    // obtiene el objeto JSON
		this.regions = obj.responseText.evalJSON(true);
		
		this.numberRegions();
		
		if (this.loadDone!=null) {
		  this.loadDone();
		};
	},
	
	//----------------------------------
	// numberRegions
	//----------------------------------
	numberRegions: function(){
	  for (var i=0; i < this.regions.length; i++) {
	   this.regions[i].num=i;
	  };
	},
	
	
	//----------------------------------
	// showRegion
	//----------------------------------
	showRegions: function(){
	  
	  if (this.regions!=null) {
	    
	    
      // si no hay regiones sacar mensaje
	    if (this.regions.length==0) {
	      $(this.destination).update('<span class="regionEmptyMessage"><br/>'+this.emptyMsg+'<br/></span>');
	      $(this.destination+'Pages').update('');
	    }else{ // si hay regiones
	      
        // crea una nueva tabla
    		var tabla = new Element('table',{'border':"0", 'cellspacing':"0", 'cellpadding':"0", 'width':"100%"});
		  
    		var row;
    		var td;
    		var a;
      
  		  row = new Element('tr');
    		// crea cabecera
		  
    		//para numero
    		td = new Element('td',{'id':this.title+'num', 'class':"regionTableSubHeader", 'width':"10%"});
    		td.update('Num');
    		td.sortField='num';
        row.appendChild(td);

    		td = new Element('td',{'id':this.title+'startPos','class':"regionTableSubHeader", 'width':"20%"});
    		td.update('Start');
    		td.sortField='startPos';
        row.appendChild(td);

    		td = new Element('td',{'id':this.title+'endPos','class':"regionTableSubHeader", 'width':"20%"});
    		td.update('End');
    		td.sortField='endPos';
        row.appendChild(td);
    
        td = new Element('td',{'id':this.title+'score','class':"regionTableSubHeader", 'width':"20%"});
    		td.update('Score');
    		td.sortField='score';
  		
        row.appendChild(td);
		
		
    		var thead = new Element('thead');
    		thead.appendChild(row);
		
    		tabla.appendChild(thead);
		
    		var tbody = new Element('tbody');
	  
  	    var ini = this.currentPage*this.pageSize;
  	    var fin = ini+this.pageSize;
	    
  	    if (fin>this.regions.length){
  	      fin=this.regions.length;
  	    };
	    
    		// recorre el array de regiones
    		for ( var r=ini; r<fin; r++ ){
		  
          // nueva row
          row= new Element('tr',{'class':'regionTableTR','id':this.title+this.regions[r].num});
          row.num =this.regions[r].num;
          row.r = r;
          // nueva celda con numero y enlace
          td = new Element('td',{'width':"10%", 'class':"regionTablePosition"});
          // a = new Element('a',{'href':"javascript:run.showPosition(" + this.regions[r].startPos + "," + this.regions[r].endPos + ",'" +this.title+"','"+ this.regions[r].num + "');"});
          //         
          //         a.update(this.regions[r].num);
          //         td.appendChild(a);
          //
        
          td.update(this.regions[r].num);
    			row.appendChild(td);
      
          // nueva celda con start
          td = new Element('td',{'width':"20%", 'class':"regionTableStart"});
          td.update(this.regions[r].startPos);
    			row.appendChild(td);
			  
          // nueva celda con end
    			td = new Element('td',{'width':"20%", 'class':"regionTableEnd"});
          td.update(this.regions[r].endPos);
    			row.appendChild(td);
			
          // nueva celda con score
    			td = new Element('td',{'width':"30%", 'class':"regionTableScore"});
          td.update(this.regions[r].score.toFixed(3));
    			row.appendChild(td);
			
          // añade la row a la tabla
    			tbody.appendChild(row);
    		};
  		
    		tabla.appendChild(tbody);
  		
    		tabla.observe('click', this.tableClick.bind(this));      
  		
    		// poner resultados en el div
    		$(this.destination).update(tabla);
  		
    		// columna orden por defecto
  	    if (this.currentSortElement!=null) {
  	      $(this.currentSortElement.id).addClassName('regionTableSubHeaderResaltada');
        
	     
  	    }else{
  	       $(this.title+'num').addClassName('regionTableSubHeaderResaltada');
  	    };
  		
  		
  		
    		$(this.destination+'Pages').update('');
  		
    		this.showPagesBar();
  		};
  	};
  },
  
  tableClick: function(e) {
    var element = e.element();
    
    // si es click en el head
    if (('sortField' in element) & (element.sortField!='')) {
            
      this.sortRegions(element.sortField,true);
      
      this.currentSortElement = element;
      
      this.showRegions();
      
      // this.ascendentSort = ! this.ascendentSort;
    }else{
      // es click en algun row
      
      // var r = parseInt(element.up('tr').down('td').textContent);
      var r = element.up('tr').r;
      
      run.showPosition(this.regions[r].startPos,this.regions[r].endPos, this.title, this.regions[r].num,true);
      
    };
    
    
  }, // handleHeaderClick 
  
  //----------------------------------
  // showPagesBar
  //----------------------------------
  showPagesBar: function(params){
    var p;
    var a;
    var tr,td;
    var tabla;
    
    tabla = new Element('table',{'border':"0", 'cellspacing':"0", 'cellpadding':"2", 'width':'100%', 'style':'align:center; vertical-align:middle; background:'});
    
    tr = new Element('tr');      
    
    // p = new Element('span',{'style':'vertical-align:middle; height:"60px"'});
    p = $(this.destination+'Pages');
    
    p.update('');
    
    if (this.pageCount()>1) {
      
      td = new Element('td');
      td.update('&nbsp;&nbsp;&nbsp;&nbsp;');
      tr.appendChild(td);
      
      td = new Element('td');      
      a = new Element('a',{'href':"javascript:run.currentGraph.regions"+this.title+".previousPage();"});
      a.update('<img src="images/prev.png" border="0" alt="Prev">&nbsp;');
      td.update(a);
      tr.appendChild(td);
      
      td = new Element('td');        
      td.update('<span style="vertical-align:middle; height:50px;">&nbsp;&nbsp;('+(this.currentPage+1)+'&nbsp;of '+(this.pageCount())+')&nbsp;&nbsp;</span>');
      tr.appendChild(td);

      // boton siguiente
      td = new Element('td');        
      a = new Element('a',{'href':"javascript:run.currentGraph.regions"+this.title+".nextPage();"});
      a.update('&nbsp;<img src="images/next.png" border="0" alt="Next">');
      td.update(a);
      tr.appendChild(td);
      
     }else{

       td = new Element('td');
       td.update('&nbsp;&nbsp;&nbsp;&nbsp;');
       tr.appendChild(td);

       td = new Element('td');
       td.update('&nbsp;&nbsp;&nbsp;&nbsp;');
       tr.appendChild(td);

       td = new Element('td');
       td.update('&nbsp;&nbsp;&nbsp;&nbsp;');
       tr.appendChild(td);
       
       
     };
     
      var type = 'SNP';
      
      if (this.destination.indexOf('above')!=-1) {
        type='CON';
      }else if (this.destination.indexOf('below')!=-1) {
        type='DIV';
      };

     //print "Content-Type:application/x-download\n";
     //print "Content-Disposition:attachment;filename=$ID\n\n"; 

      if (this.pageCount()>0) {
          td = new Element('td',{ 'style' : 'text-align: right;'});

      		a = new Element('a',{'href':cgiPath+'download.cgi?F='+this.runid + '/data/' + this.graphName + '_'+type+'.maf'});
          a.update('&nbsp;&nbsp;&nbsp;<img src="images/save.gif" border="0" alt="Save">');
          td.update(a);
          tr.appendChild(td);
          
      }else{
        
           td = new Element('td');
           td.update('&nbsp;&nbsp;&nbsp;&nbsp;');
           tr.appendChild(td);
      };
      
      
      tabla.appendChild(tr);
      
      p.update(tabla);
      
		// poner resultados en el div
    // $(this.destination+'Pages').update(tabla);
		
    // $(this.destination+'Save').update(a);
    
    
  },
  
  
  //----------------------------------
  // showPagesBar
  //----------------------------------
  showPagesBarOld: function(){
    
    var p;
    var a;
    
    // p = new Element('span',{'style':'vertical-align:middle; height:"60px"'});
    p = $(this.destination+'Pages');
    p.update('');
    
    if (this.pageCount()>1) {
      
        // if (this.currentPage>0){
          // boton anterior
           a = new Element('a',{'href':"javascript:run.currentGraph.regions"+this.title+".previousPage();"});
           a.update('<img src="images/prev.png" border="0" alt="Prev">&nbsp;');
           p.appendChild(a);
        // }
    
        if (this.currentPage>1){
          // p.appendChild(new Element('p').update('...'));
        }
    
        // // for (var i=0; i <= this.pageCount(); i++) {
        // for (var i=this.currentPage; i <= this.currentPage+2; i++) {
        //   
        //   a = new Element('a',{'href':"javascript:regions.gotoPage("+(i+1)+");"});
        //   a.update((i+1)+'&nbsp;|&nbsp;');//&nbsp;
        //   // a.update('&nbsp;&bull;&nbsp;');
        //   p.appendChild(a);
        // };
    
        // p.appendChild('&nbsp;&bull;&nbsp;');
        // var midP = Math.floor((this.pageCount()-this.currentPage)/2);
        //     
        //     a = new Element('a',{'href':"javascript:regions.gotoPage("+(midP)+");"});
        //     a.update('...&nbsp;'+(midP)+'&nbsp;...&nbsp;|&nbsp;');//&nbsp;
        //     p.appendChild(a);
        //     

    
        // a = new Element('a',{'href':""});
        p.insert('<span style="vertical-align:middle; height:50px;">&nbsp;&nbsp;('+(this.currentPage+1)+'&nbsp;de '+(this.pageCount())+')&nbsp;&nbsp;</span>');//&nbsp;
        // p.appendChild(a);
    
    
        // // for (var i=0; i <= this.pageCount(); i++) {
        // for (var i=this.pageCount()-2; i <= this.pageCount(); i++) {
        //   
        //   a = new Element('a',{'href':"javascript:regions.gotoPage("+(i+1)+");"});
        //   a.update((i+1)+'&nbsp;|&nbsp;');//&nbsp;
        //   // a.update('&nbsp;&bull;&nbsp;');
        //   p.appendChild(a);
        // };
    

        // boton siguiente
        // if (this.currentPage<this.pageCount()){
          a = new Element('a',{'href':"javascript:run.currentGraph.regions"+this.title+".nextPage();"});
          a.update('&nbsp;<img src="images/next.png" border="0" alt="Next">');
          p.appendChild(a);
         // };
         
     };
     
      var type = 'SNP';
      
      if (this.destination.indexOf('above')!=-1) {
        type='CON';
      }else if (this.destination.indexOf('below')!=-1) {
        type='DIV';
      };

     //print "Content-Type:application/x-download\n";
     //print "Content-Disposition:attachment;filename=$ID\n\n"; 
      
  		a = new Element('a',{'href':cgiPath+'download.cgi?F='+this.runid + '/data/' + this.graphName + '_'+type+'.maf'});
      a.update('&nbsp;&nbsp;&nbsp;<img src="images/save.gif" border="0" alt="Save">');
      p.appendChild(a);
      
		// poner resultados en el div
    // $(this.destination+'Pages').update(p);
		
    // $(this.destination+'Save').update(a);
    
    
  },
  
  //----------------------------------
  // pageCount
  //----------------------------------
  pageCount: function(){
    return Math.ceil(this.regions.length/this.pageSize);
  },
  
  //----------------------------------
  // nextPage
  //----------------------------------
  nextPage: function(){
    if (this.currentPage<this.pageCount()-1) {
      this.currentPage++;
      this.showRegions();
    };
  },
  
  //----------------------------------
  // previousPage
  //----------------------------------
  previousPage: function(){
    if (this.currentPage>0) {
      this.currentPage--;
      this.showRegions();
    };
  },
  
  //----------------------------------
  // gotoPage
  //----------------------------------
  gotoPage: function(page){
    
    if ((page>0) & (page<=this.pageCount())) {
      this.currentPage=page-1;
      this.showRegions();
    };
  },
  
  //----------------------------------
  // findRegionAt
  //----------------------------------
  findRegionAt: function(pos,off){
    // var num = null;
    var reg = null;
    
    if (this.regions!=null) {
      // $('evtInfo').insert('<br>reg pos:'+pos);
      
      var i =0;
      var le = this.regions.length;
      var salir = false;
      
      while ((i<le) & (!salir)) {
        
        // if (this.regions[i].endPos>pos){
        //            salir=true;
        //            break;
        //  };
        
        if ((pos>=this.regions[i].startPos-off) & (pos<=this.regions[i].endPos+off)) {
          // num = i;
          reg = this.regions[i];
          salir=true;
          // $('evtInfo').insert('<br>found :'+pos+' at region:'+elem);
        };
        
        i++;
        
      };
      
      // if (salir) {
      //   $('evtInfo').insert('<br>found Its :'+i+' at region:'+elem);
      // };
      
    };
    
    // return [num,reg];
    return reg;
  },
  
  //----------------------------------
  // findNextRegion
  //----------------------------------
  findNextRegion: function(pos){
    var num = null;
    var reg = null;
    
    if (this.regions!=null) {
      // $('evtInfo').insert('<br>find next reg:'+pos);
      
      var i =0;
      var le = this.regions.length;
      var salir = false;
      
      while ((i<le) & (!salir)) {
        
        // if (this.regions[i].endPos>pos){
        //           salir=true;
        //           break;
        // };
        // $('evtInfo').insert('<br>find :'+pos+' in :'+this.regions[i].startPos+','+this.regions[i].endPos);
        if ((this.regions[i].startPos>=pos)) {
          num = i;
          reg = this.regions[i];
          salir=true;
          // $('evtInfo').insert('<br>found :'+pos+' at region:'+elem);
        };
        
        i++;
        
      };
      
      // if (salir) {
      //   $('evtInfo').insert('<br>NextReg:'+num);
      // };      
      
    };
    
    return [num,reg];
  },

  //----------------------------------
  // findPrevRegion
  //----------------------------------
  findPrevRegion: function(pos){
    var num = null;
    var reg = null;
    
    if (this.regions!=null) {
      // $('evtInfo').insert('<br>reg pos:'+pos);
      // $('evtInfo').insert('<br>find prev reg:'+pos);

      var le = this.regions.length;
      var i =le-1;
      var salir = false;
      
      while ((i>=0) & (!salir)) {
        
        // if (this.regions[i].endPos>pos){
        //                   salir=true;
        //                   break;
        //         };
        // $('evtInfo').insert('<br>find :'+pos+' in :'+this.regions[i].startPos+','+this.regions[i].endPos);
        if ((this.regions[i].endPos<=pos)) {
          num = i;
          reg = this.regions[i];
          salir = true;
          // $('evtInfo').insert('<br>found :'+pos+' at region:'+elem);
        };
        
        i--;
        
      };
      
      // if (salir) {
      //   $('evtInfo').insert('<br>PrevReg:'+num);
      // };
      
    };
    
    return [num,reg];
  },
  
  //----------------------------------
  // sortRegions
  //----------------------------------
  sortRegions: function(field,desc){
    this.regions.sort( function (a, b){
    //Compare "a" and "b" in some fashion, and return -1, 0, or 1
      return (a[field]-b[field]);
    }
    );
  },
  
  //----------------------------------
  // getPageOfRegion
  //----------------------------------
  getPageOfRegion: function(pos){
      var page = -1;
      var num = -1;
      var le = this.regions.length;
      var i =le-1;
      var salir = false;
      
      while ((i>=0) & (!salir)) {
                
        if ((this.regions[i].num==pos)) { // encontramos la región
          num = i;
          salir = true;
        };
        
        i--;
      };
      
      page = Math.floor(num/this.pageSize);
      
      return page;
  },
  
  
  //----------------------------------
  // showPageOfRegion
  //----------------------------------
  showPageOfRegion: function(pos){
    var page = this.getPageOfRegion(pos);
    
    this.gotoPage(page+1);
    
  },
  
  
  
  
});
