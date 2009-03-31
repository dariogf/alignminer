<?php
function gc_cont($seq) {
  $foo = ereg_replace("[AT]","",$seq);
  $gc = strlen($foo)/strlen($seq);
  return $gc;
}

function temp_m($oligo_one) {
  $deltaH = array(
    'AXTX'=>'2.3',
    'TXAX'=>'2.3',
    'CXGX'=>'0.1',
    'GXCX'=>'0.1',
    'XAXT'=>'2.3',
    'XTXA'=>'2.3',
    'XCXG'=>'0.1',
    'XGXC'=>'0.1',
    'AATT'=>'-7.9',
    'ATTA'=>'-7.2',
    'ACTG'=>'-8.4',
    'AGTC'=>'-7.8',
    'TAAT'=>'-7.2',
    'TTAA'=>'-7.9',
    'TCAG'=>'-8.2',
    'TGAC'=>'-8.5',
    'CAGT'=>'-8.5',
    'CTGA'=>'-7.8',
    'CCGG'=>'-8.0',
    'CGGC'=>'-10.6',
    'GACT'=>'-8.2',
    'GTCA'=>'-8.4',
    'GCCG'=>'-9.8',
    'GGCC'=>'-8.0');

  $deltaS = array(
    'AXTX'=>'4.1',
    'TXAX'=>'4.1',
    'CXGX'=>'-2.8',
    'GXCX'=>'-2.8',
    'XAXT'=>'4.1',
    'XTXA'=>'4.1',
    'XCXG'=>'-2.8',
    'XGXC'=>'-2.8',
    'AATT'=>'-21.3',
    'ATTA'=>'-20.4',
    'ACTG'=>'-22.4',
    'AGTC'=>'-21.0',
    'TAAT'=>'-21.3',
    'TTAA'=>'-21.3',
    'TCAG'=>'-22.2',
    'TGAC'=>'-22.7',
    'CAGT'=>'-22.7',
    'CTGA'=>'-21.0',
    'CCGG'=>'-19.9',
    'CGGC'=>'-27.2',
    'GACT'=>'-22.2',
    'GTCA'=>'-22.4',
    'GCCG'=>'-24.4',
    'GGCC'=>'-19.9');
  
  $gc_content = gc_cont($oligo_one);
  $oligo_one = "X".$oligo_one."X";
  $oligo_two = $oligo_one;
  $oligo_two = strtr($oligo_two,"ATCGX","TAGCX");
  $dH = 0;
  $dS = 0;
  for ($f=0;$f<(strlen($oligo_one))-1;$f++){
    $dH += $deltaH[substr($oligo_one,$f,2).substr($oligo_two,$f,2)];
  }
  for ($f=0;$f<(strlen($oligo_one))-1;$f++){
    $dS += $deltaS[substr($oligo_one,$f,2).substr($oligo_two,$f,2)];
  }
  $tm0 = (1000*$dH) / ($dS+(1.987*log((.5*1e-6)/2))); 
  # Tm, non-corrected Tm for salt concentration. Primer concentration in micromolar 0.5
  $corr = 1/$tm0 + (4.29*$gc_content-3.95)*1e-5*log(50/1000) + 9.4e-6*pow(log(50/1000),2)-pow(log(1),2); 
  # Corrected Tm Na+ concentration in millimolar is 50
  $tm = 1/$corr-273.15;
  return $tm;
}

function deltaG($pattern) {
  $deltaG = array(
  'AXTX'=>'1.03',
  'TXAX'=>'1.03',
  'CXGX'=>'0.98',
  'GXCX'=>'0.98',
  'XAXT'=>'1.03',
  'XTXA'=>'1.03',
  'XCXG'=>'0.98',
  'XGXC'=>'0.98',
  'AATT'=>'-1.00',
  'ATTA'=>'-0.88',
  'ACTG'=>'-1.44',
  'AGTC'=>'-1.28',
  'TAAT'=>'-0.58',
  'TTAA'=>'-1.00',
  'TCAG'=>'-1.30',
  'TGAC'=>'-1.45',
  'CAGT'=>'-1.45',
  'CTGA'=>'-1.28',
  'CCGG'=>'-1.84',
  'CGGC'=>'-2.17',
  'GACT'=>'-1.30',
  'GTCA'=>'-1.44',
  'GCCG'=>'-2.24',
  'GGCC'=>'-1.84',
  'AAAT'=>'0.69',
  'AATA'=>'0.61',
  'AATC'=>'0.88',
  'AATG'=>'0.14',
  'AACT'=>'1.33',
  'AAGT'=>'0.74',
  'ATAA'=>'0.61',
  'ATTT'=>'0.69',
  'ATTC'=>'0.73',
  'ATTG'=>'0.07',
  'ATCA'=>'0.77',
  'ATGA'=>'0.02',
  'ACAG'=>'0.17',
  'ACTA'=>'0.77',
  'ACTT'=>'0.64',
  'ACTC'=>'1.33',
  'ACCG'=>'0.47',
  'ACGG'=>'-0.52',
  'AGAC'=>'0.43',
  'AGTA'=>'0.02',
  'AGTT'=>'0.71',
  'AGTG'=>'-0.13',
  'AGCC'=>'0.79',
  'AGGC'=>'0.11',
  'TAAA'=>'0.69',
  'TAAC'=>'0.92',
  'TAAG'=>'0.42',
  'TATT'=>'0.68',
  'TACT'=>'0.97',
  'TAGT'=>'0.43',
  'TTAT'=>'0.68',
  'TTAC'=>'0.75',
  'TTAG'=>'0.34',
  'TTTA'=>'0.69',
  'TTCA'=>'0.64',
  'TTGA'=>'0.71',
  'TCAA'=>'1.33',
  'TCAT'=>'0.97',
  'TCAC'=>'1.05',
  'TCTG'=>'0.45',
  'TCCG'=>'0.62',
  'TCGG'=>'0.08',
  'TGAA'=>'0.74',
  'TGAT'=>'0.43',
  'TGAG'=>'0.44',
  'TGTC'=>'-0.12',
  'TGCC'=>'0.62',
  'TGGC'=>'-0.47',
  'CAAT'=>'0.92',
  'CATT'=>'0.75',
  'CACT'=>'1.05',
  'CAGA'=>'0.43',
  'CAGC'=>'0.75',
  'CAGG'=>'0.03',
  'CTAA'=>'0.88',
  'CTTA'=>'0.73',
  'CTCA'=>'1.33',
  'CTGT'=>'-0.12',
  'CTGC'=>'0.40',
  'CTGG'=>'-0.32',
  'CCAG'=>'0.81',
  'CCTG'=>'0.98',
  'CCCG'=>'0.79',
  'CCGA'=>'0.79',
  'CCGT'=>'0.62',
  'CCGC'=>'0.70',
  'CGAC'=>'0.75',
  'CGTC'=>'0.40',
  'CGCC'=>'0.70',
  'CGGA'=>'0.11',
  'CGGT'=>'-0.47',
  'CGGG'=>'-0.11',
  'GAAT'=>'0.42',
  'GATT'=>'0.34',
  'GACA'=>'0.17',
  'GACC'=>'0.81',
  'GACG'=>'-0.25',
  'GAGT'=>'0.44',
  'GTAA'=>'0.14',
  'GTTA'=>'0.07',
  'GTCT'=>'0.45',
  'GTCC'=>'0.98',
  'GTCG'=>'-0.59',
  'GTGA'=>'-0.13',
  'GCAG'=>'-0.25',
  'GCTG'=>'-0.59',
  'GCCA'=>'0.47',
  'GCCT'=>'0.62',
  'GCCC'=>'0.79',
  'GCGG'=>'-1.11',
  'GGAC'=>'0.03',
  'GGTC'=>'-0.32',
  'GGCA'=>'-0.52',
  'GGCT'=>'0.08',
  'GGCG'=>'-1.11',
  'GGGC'=>'-0.11',
  'AAXT'=>'-0.51',
  'ATXA'=>'-0.50',
  'ACXG'=>'-0.96',
  'AGXC'=>'-0.58',
  'AXTA'=>'-0.50',
  'AXTT'=>'-0.10',
  'AXTC'=>'-0.02',
  'AXTG'=>'0.48',
  'TAXT'=>'-0.71',
  'TTXA'=>'-0.10',
  'TCXG'=>'-0.58',
  'TGXC'=>'-0.61',
  'TXAA'=>'-0.51',
  'TXAT'=>'-0.71',
  'TXAC'=>'-0.42',
  'TXAG'=>'-0.62',
  'CAXT'=>'-0.42',
  'CTXA'=>'-0.02',
  'CCXG'=>'-0.52',
  'CGXC'=>'-0.34',
  'CXGA'=>'-0.58',
  'CXGT'=>'-0.61',
  'CXGC'=>'-0.34',
  'CXGG'=>'-0.56',
  'GAXT'=>'-0.62',
  'GTXA'=>'0.48',
  'GCXG'=>'-0.72',
  'GGXC'=>'-0.56',
  'GXCA'=>'-0.96',
  'GXCT'=>'-0.58',
  'GXCC'=>'-0.52',
  'GXCG'=>'-0.72',
  'AATX'=>'-0.12',
  'ATTX'=>'0.13',
  'ACTX'=>'0.28',
  'AGTX'=>'-0.01',
  'TAAX'=>'-0.48',
  'TTAX'=>'-0.29',
  'TCAX'=>'-0.19',
  'TGAX'=>'-0.50',
  'CAGX'=>'-0.82',
  'CTGX'=>'-0.52',
  'CCGX'=>'-0.31',
  'CGGX'=>'-0.01',
  'GACX'=>'-0.92',
  'GTCX'=>'-0.35',
  'GCCX'=>'-0.23',
  'GGCX'=>'-0.44',
  'XAAT'=>'-0.48',
  'XATT'=>'-0.29',
  'XACT'=>'-0.19',
  'XAGT'=>'-0.50',
  'XTAA'=>'-0.12',
  'XTTA'=>'0.13',
  'XTCA'=>'0.28',
  'XTGA'=>'-0.01',
  'XCAG'=>'-0.92',
  'XCTG'=>'-0.35',
  'XCCG'=>'-0.23',
  'XCGG'=>'-0.44',
  'XGAC'=>'-0.82',
  'XGTC'=>'-0.52',
  'XGCC'=>'-0.31',
  'XGGC'=>'-0.01');

  if (isset($deltaG[$pattern])) {
    return $deltaG[$pattern];
  } else {return 0;}
}

function dimer($oligo_one, $oligo_two) {
  $oligo_one = "X".$oligo_one."X";
  $oligo_two = "X".$oligo_two."X";
  $oligo_two = strrev($oligo_two);
  if (isset($min_value)) {
    unset($min_value);
  }
  if (strlen($oligo_one) < strlen($oligo_two)) {
    $bigger_seq = $oligo_two;
    $smaller_seq = $oligo_one;
  }
  if (strlen($oligo_one) >= strlen($oligo_two)) {
    $bigger_seq = strrev($oligo_one);
    $smaller_seq = strrev($oligo_two);
  }
  if (strlen($oligo_one) != strlen($oligo_two)) {
    for ($m=0;$m<(strlen($bigger_seq))-(strlen($smaller_seq));$m++) {
      $bigger_part = substr($bigger_seq,0,strlen($smaller_seq));
      $value = 0;
      for ($c=0;$c<=(strlen($smaller_seq))-2;$c++) {
	$partial = deltaG(substr($smaller_seq,$c,2).substr($bigger_part,$c,2));
	$value += $partial;
      }
      if (!isset($min_value)) {
	$min_value=$value;
      }
      if ($value<$min_value){
	$min_value = $value;
      }
    }
    if ($value<$min_value){
      $min_value = $value;
    }
  }
  $xpto = 0; 
  for ($x=2;$x<=((strlen($smaller_seq))*2)-2;$x++) {
    if ($x <= strlen($smaller_seq)) {
      $z=$x;
      $upper_stretch = substr($smaller_seq,(strlen($smaller_seq))-$z,$z);
      $lower_stretch = substr($bigger_seq,0,$z);
    }
    if ($x == strlen($smaller_seq) && $xpto==0) {
      $z=$x;
      $upper_stretch = substr($smaller_seq,(strlen($smaller_seq))-$z,$z);
      $lower_stretch = substr($bigger_seq,0,$z);
    }
    if ($x == strlen($smaller_seq) && $xpto==1) {
      $z= (strlen($smaller_seq))*2-$x;
      $upper_stretch = substr($smaller_seq,0,$z);
      $lower_stretch = substr($bigger_seq,(strlen($bigger_seq))-$z,$z);
    }
    if ($x>strlen($smaller_seq)) {
      $z= (strlen($smaller_seq))*2-$x;
      $upper_stretch = substr($smaller_seq,0,$z);
      $lower_stretch = substr($bigger_seq,(strlen($bigger_seq))-$z,$z);
    }
    $value = 0;
    for ($t=0;$t<=(strlen($upper_stretch))-2;$t++) {
      $partial = deltaG (substr ($upper_stretch,$t,2).substr($lower_stretch,$t,2));
      $value += $partial;
    }
    if (!isset($min_value)) {
      $min_value=$value;
    }
    if ($value<$min_value){
      $min_value = $value;
    }
    if ($x == strlen($smaller_seq) && $xpto==0){
      $xpto=1;
      $x--;
      next;
    }
  }
  if (!isset($min_value)) {
    $min_value = 0;
  }
  return $min_value;
}

function hairpin($line) {
  $rev_line = strrev($line);
  if (isset($min_deltaG)) {
    unset($min_deltaG);
  }
  for($loop=3;$loop<7;$loop++){
    for ($s=2;$s<(strlen($line))-$loop-2;$s++){
      $not_s = (strlen($line))-$loop-$s;
      if ($s<=$not_s){
	$fragment = $s;
      }
      else {
	$fragment = $not_s;
      }
      $upper = "X".substr($line,(strlen($line))-$s-$loop-$fragment,$fragment);
      $lower = "X".substr($rev_line,$s-$fragment,$fragment);
      $deltaG_value = 0;
      for ($k=0;$k<$fragment+1;$k++){
	$deltaG_value += deltaG(substr($upper,$k,2).substr ($lower,$k,2));
      }
      if (!isset($min_deltaG)) {
	$min_deltaG = $deltaG_value;
      }
      if ($min_deltaG>$deltaG_value){
	$min_deltaG = $deltaG_value;
      }
    }
  }
  if (!isset($min_deltaG)) {
    $min_deltaG = 0;
  }
  return $min_deltaG;
}

?>
