#!/usr/bin/php

<?php
	// uses external commands
	@require_once("include.php");
		              
	// create new asociative arrays
	$res = array();
		
	// check if oligo is OK to be processed
	function check_oligo($olg='')
	{
		
		// bases must be in uppercases
		$oligo = strtoupper($olg);
		
		// oligos only have actg
		if (!ereg("^[ATGC]+$",$oligo)) {
	  	$oligo='';
		}
		  
		// oligos length must be between 15, and 50
		if (!ereg("^[ATGC]{15,50}$",$oligo)) {
			$oligo='';
		}
    
		return $oligo;
	}
	
  $inputStr=$argv[1];
  // 
  // print($inputStr);
  
  $input = json_decode($inputStr,true);
          
  // print "algo";
  // var_dump($input);
  
	
	// for each argument
  // for ($i=1; $i < $argc; $i++) { 
  foreach ($input as $seq_name => $oligo) {
    
		// create a new hash for the element
		$elem = array();
		 
		 
		$elem['seq'] = $oligo; 
		
		// get oligo
		$oligo=check_oligo($oligo);
		
		
		 
		// if oligo is empty
		if ($oligo == '') {
			
			// but it was not empty at beggining
			if ($argv[$i]!=''){
				
				// set error
				$elem['error']='Invalid';
				
				// save element in hash
				$res[$seq_name]=$elem;
		
			}
			
		}else{ // oligo is not emtpy

			// extract values
		  $gc = gc_cont($oligo);
      $tm = temp_m($oligo);
      $hairpin = hairpin($oligo);
      $dimer = dimer($oligo, $oligo);

			// check harpins
      if ($hairpin>-3) {
				$hairpintext = "Not likely"; // green
      } else if ($hairpin>-5) {
				$hairpintext = "Somewhat likely"; // orange
      } else {
				$hairpintext = "Likely"; // red
      }

			// check dimmers
      if ($dimer>-6) {
				$dimertext = "Not likely"; // green
      } else if ($dimer>-8) {
				$dimertext = "Somewhat likely"; // orange
      } else {
				$dimertext = "Likely"; // red
      }

			// check temp
      if ($tm<52) {
				$tmcolour = "blue";
      } else if ($tm>62) {
				$tmcolour = "red";
      } else {
				$tmcolour = "green";
      }
	  
			// save values in hash 
			$elem['gc'] = round($gc,4);
		
		  $elem['hairpin'] = $hairpin;
		  $elem['hairpintext'] = $hairpintext;
	
		  $elem['dimer'] = $dimer;
		  $elem['dimertext'] = $dimertext;
		
		  $elem['tm'] = round($tm,4);
		  $elem['tmcolour'] = $tmcolour;
	    
			
			// save element in hash
			$res[$seq_name]=$elem;
			
		}
		
	}
	
	// convert to json and print
	print(json_encode($res));
	
?>
