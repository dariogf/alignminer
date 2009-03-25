//=======================================
//Clase para ordenar tablas
//
// v0.1 - 20080426 - Diego Darío Guerrero
//=======================================

var TRegionTableSorter = Class.create({

  //Constructor
  initialize: function(tableID) {
    this.tableID = tableID;
    
    this.table = $(tableID);
    
    this.sortColumn = -1; 
    this.asc = true;
    
    this.initDOMReferences(); 
    this.initEventHandlers();
    
  },
  
  initDOMReferences: function() { 
    var head = this.table.down('thead'); 
    var body = this.table.down('tbody'); 
    
    if (!head || !body) 
      throw 'Table must have a head and a body to be sortable.'; 
    
    // this.headers = head.down('tr').childElements();
    //   
    // this.headers.each(function(e, i) { 
    //   e._colIndex = i;
    // }); 
  
    this.body = body; 
  }, // initDOMReferences 
  
  
   
  initEventHandlers: function() { 
    this.handler = this.handleHeaderClick.bind(this); 
    this.element.observe('click', this.handler); 
  }, // initEventHandlers 
  
  handleHeaderClick: function(e) { 
    var element = e.element();
    
    if (!('sortField' in element)) { 
      element = element.ancestors().find(function(elt) { 
        return 'sortField' in elt; 
      }); 
      
      if (!((element) && '_colIndex' in element)) 
        return; 
    }
    
    this.sort(element._colIndex); 
    
  }, // handleHeaderClick 
  
  

});