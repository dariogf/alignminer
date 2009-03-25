//=======================================
//Clase para gestionar las listas de trabajos
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TJobList = Class.create({

  //Constructor
  initialize: function(userid,destinationTable, wellcomeMessage) {
    this.userid = userid;
    
    this.destinationTable = destinationTable;
    
    this.maxRequestAllowed = 3;
    
    this.requestCount=0;
    this.running = false;
    
    this.wellcomeMessage = wellcomeMessage;
    
    this.jobList = null;
    

    this.processedUserName = '';
    
    this.checkUserRequest=null;
    
    
  },
  
  //----------------------------------
  // checkUser
  //----------------------------------
  checkUser: function(userid){
    
    this.checkUserRequest  = new Ajax.Request(cgiPath+'checkUser.cgi?USERID='+this.userid, {
          method:'get',
          requestHeaders: {Accept: 'application/text'},
          asynchronous:false
        });
        
    var cu = this.checkUserRequest.transport.responseText.evalJSON(true);
    
    if (cu.validUser) {
          this.processedUserName = cu.processedUserName;
      
          this.validUser = cu.validUser;
        
    
    };
    
    return this.validUser;
    
  },
  
  
  //----------------------------------
  // getByID
  //----------------------------------
  getByID: function(id){
    var res = null;
    
    for (var i=0; i < this.jobList.length; i++) {
      if (this.jobList[i].id==id) {
        res = this.jobList[i];
      };
    };
    
    return res;
  },
  
  
  //----------------------------------
  // startPolling
  //----------------------------------
  startPolling: function(count){
    
    this.requestCount = 0;
    
    
    // si hay que hacer un polling profundo, llevar cuenta
    if (count>1) {
            
        if (!this.running){
        
          this.running = true;
      
          this.jobListRequester = new PeriodicalExecuter((function(pe){
          // pide el archivo al servidor
          new Ajax.Request(cgiPath+'getJobList.cgi?USERID='+this.userid, {
                method:'get',
                requestHeaders: {Accept: 'application/text'},
                onSuccess: this.processReceivedJobList.bind(this)
              });
          }).bind(this), 2);

        
        };
        
      }else {
        new Ajax.Request(cgiPath+'getJobList.cgi?USERID='+this.userid, {
              method:'get',
              requestHeaders: {Accept: 'application/text'},
              onSuccess: this.processReceivedJobList.bind(this)
            });
            
        
        
      };
    

    
  },
  
  //----------------------------------
  // stopPolling
  //----------------------------------
  stopPolling: function(){
    if (this.jobListRequester!=null) {
          this.jobListRequester.stop();
    };
    
    this.running = false;
  },
  
  

  //----------------------------------
  // processReceivedJobList
  //----------------------------------
  processReceivedJobList: function(obj){
    
    this.jobList = obj.responseText.evalJSON(true);
    
    this.requestCount++;
     
    this.refreshJobListTable();
    
    $(this.wellcomeMessage).update('&nbsp;&nbsp;Welcome '+this.userid);
        
  },
  
  //----------------------------------
  // updateTDInfo
  //----------------------------------
  updateTDInfo: function(td,job,elem){
    td.update('---');
    if (job.status!="ERROR") {
      info = job.qinfo;
      if (info!=undefined) {
        if (info[elem]!=undefined) {
           td.update(info[elem]);
        };
      };      
    };
  },
  
  
  //----------------------------------
  // refreshJobListTable
  //----------------------------------
  refreshJobListTable: function(params){
    
    // this.stopPolling();
    var RUNNING = false;
    
    //     for ( var r=ini; r<fin; r++ ){
    //     
    //      if ((this.jobList[r].status=='RUNNING') | (this.jobList[r].status=='QUEUED')) {
    //    RUNNING = true;
    //  };
    // };
		
    // if ((RUNNING == false) & (this.requestCount>1)) {
    //         this.stopPolling();
    //     };
    
    // crea una nueva tabla
		var tabla = new Element('table',{'class':'jobListTable','border':"0", 'cellspacing':"0", 'cellpadding':"2", 'width':"100%"});
	
		var row;
		var td;
		var a;
		
		
    
	  row = new Element('tr');
		// crea cabecera
	  
		//para numero
		td = new Element('td',{'width':"10%"});
		td.update('JOB ID');
    // td.sortField='num';
    row.appendChild(td);
    
		td = new Element('td',{'width':"16%"});
		td.update('File name');
    // td.sortField='startPos';
    row.appendChild(td);
    
    td = new Element('td',{'width':"10%"});
		td.update('Master seq.');
    // td.sortField='startPos';
    row.appendChild(td);
		
    
		td = new Element('td',{'width':"7%"});
		td.update('File type');
    // td.sortField='startPos';
    row.appendChild(td);
    
    td = new Element('td',{'width':"7%"});
		td.update('Seq. type');
    // td.sortField='startPos';
    row.appendChild(td);
		
		td = new Element('td',{'width':"10%"});
		td.update('Length');
    // td.sortField='startPos';
    row.appendChild(td);
		
		td = new Element('td',{'width':"5%"});
		td.update('N. Seqs.');
    // td.sortField='startPos';
    row.appendChild(td);
		
		td = new Element('td',{'width':"5%"});
		td.update('Result size');
    // td.sortField='startPos';
    row.appendChild(td);

		td = new Element('td',{'width':"20%"});
		td.update('STEP');
    // td.sortField='endPos';
    row.appendChild(td);
  
    td = new Element('td',{'width':"10%"});
		td.update('STATUS');
    // td.sortField='score';
    row.appendChild(td);
    
    td = new Element('td',{'width':"2%"});
		td.update('');
    // td.sortField='score';
    row.appendChild(td);
	
		var thead = new Element('thead');
		thead.appendChild(row);
	
		tabla.appendChild(thead);
	
    var tbody = new Element('tbody');
    
    
    var ini = 0;
    var fin = this.jobList.length;
    
    // var ini = this.currentPage*this.pageSize;
    // var fin = ini+this.pageSize;
    // 
    // if (fin>this.regions.length){
    //   fin=this.regions.length;
    // };
    
    var rowClass='odd';
    var jname='';
    var fname='';
    
    // recorre el array de trabajos
    for ( var r=ini; r<fin; r++ ){

      rowClass = 'even';
      if (r % 2) {
        rowClass = 'odd';
      };
      // nueva row
      row= new Element('tr',{'class':rowClass,'id':this.jobList.id});
      row.id =this.jobList[r].id;
      row.r = r;
      
      
      jname = this.jobList[r].id;
      
      if (this.jobList[r].qinfo!=undefined) {
        if (this.jobList[r].qinfo.jobName!='') {
          jname = this.jobList[r].qinfo.jobName;
        };
      };
      
      // nueva celda jobid/name
      td = new Element('td',{'width':"10%", 'class':"id"});
      if (this.jobList[r].status=='DONE') {
        a = new Element('a',{'href':"javascript:showRun('"+jname+"','" +this.jobList[r].id + "',jobList);"});
        a.update(jname);
        td.update(a);
        
      }else{
        td.update(jname);
      };
			row.appendChild(td);

      // nueva celda con fname 
      td = new Element('td',{'width':"16%"});
      this.updateTDInfo(td,this.jobList[r],'fileName');
			row.appendChild(td);
		  
		  // nueva celda con master
      td = new Element('td',{'width':"10%"});
      this.updateTDInfo(td,this.jobList[r],'master');
			row.appendChild(td);
      
		  // nueva celda con ftype
      td = new Element('td',{'width':"7%"});
      this.updateTDInfo(td,this.jobList[r],'fileType');
			row.appendChild(td);
      
      // nueva celda con seq type
      td = new Element('td',{'width':"7%"});
      this.updateTDInfo(td,this.jobList[r],'alphabet');
			row.appendChild(td);
      
      // nueva celda con a length
      td = new Element('td',{'width':"10%"});
      this.updateTDInfo(td,this.jobList[r],'length');
			row.appendChild(td);
      
      // nueva celda con num seqs
      td = new Element('td',{'width':"5%"});
      this.updateTDInfo(td,this.jobList[r],'numberOfSequences');
			row.appendChild(td);
			
			// nueva celda con result size
      td = new Element('td',{'width':"5%"});
      this.updateTDInfo(td,this.jobList[r],'resultSize');
			row.appendChild(td);
      
      // nueva celda con step
			td = new Element('td',{'width':"20%"});
			td.update('-');
			if (this.jobList[r].qinfo!=undefined) {
			  if (this.jobList[r].qinfo.stageDescription!=undefined) {
  			  td.update(this.jobList[r].qinfo.stageDescription + '  ('+this.jobList[r].qinfo.stagesDone+'/'+this.jobList[r].qinfo.stagesCount+')');
  			};
			};
			row.appendChild(td);
		  
      // nueva celda con status
			td = new Element('td',{'width':"10%"});
      // if (this.jobList[r].status=='DONE') {
      //   a = new Element('a',{'href':"javascript:deleteRun('" +this.jobList[r].id + "',jobList)"});
      //         a.update('<img src="images/borrar.png" border="0" alt="Borrar">');
      //         td.update(a);
      // }else{
        if (this.jobList[r].status=='RUNNING') {
          td.update('<span id="runningIndicator">'+this.jobList[r].status+'</span>');
        }else{
          
          if (this.jobList[r].status=='ERROR') {
              td.update('<span id="errorIndicator">'+this.jobList[r].status+'</span>');
          }else{
              td.update(this.jobList[r].status);
          };
          
        };

        
      // };     
			row.appendChild(td);


		  
		  // nueva celda con status
			td = new Element('td',{'width':"2%"});
			if ((this.jobList[r].status!='RUNNING') & (this.jobList[r].status!='QUEUED')) {
			  a = new Element('a',{'href':"javascript:deleteRun('" +this.jobList[r].id + "')"});
        a.update('<img src="images/borrar.png" border="0" alt="Borrar">');
        td.update(a);
      }else if (this.jobList[r].status=='RUNNING'){
        td.update('<img src="images/smallLoader'+rowClass+'.gif" border="0" alt="SL">');
      }else{
        td.update('');
      }
      
			row.appendChild(td);
		  
      // añade la row a la tabla
			tbody.appendChild(row);
			
			if ((this.jobList[r].status=='RUNNING') | (this.jobList[r].status=='QUEUED')) {
			  RUNNING = true;
			};
			
		};
		
		tabla.appendChild(tbody);
		
    // tabla.observe('click', this.tableClick.bind(this));
		
    // era 3
    
        // si no hay nadie andando, parar
    if ((!RUNNING) & (this.requestCount>this.maxRequestAllowed)) {
            this.stopPolling();
    };
        
    // if (RUNNING){
    //       this.startPolling();
    // }
    //    
		// poner resultados en el div
		$(this.destinationTable).update(tabla);
		
  },
  

});
