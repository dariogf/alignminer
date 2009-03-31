<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN">
<html>
<head>
<title>Webtag</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link href="css/layout.css" rel="stylesheet" type="text/css">
</head>
<body>  
<div id="layout">
<div id="sidhuvud">
  <img src="image/webtag.jpg" alt="Webtag">
</div>
<div id="kolumncontainer">
<div id="kolumn1">
<div id="menycontainer">
<ul id="meny">
    <li><a href="index.php">Webtag</a></li>
    <li><a href="batch.php">Batch processing</a></li>
    <li><a href="intro.php">Introduction</a></li>
    <li><a href="properties.php">Properties of TAGs</a></li>
    <li><a href="faq.php">FAQ</a></li>
    <li><a href="oligocalc.php" id="current">Oligo calculator</a></li>
    <li><a href="contact.php">Contact</a></li>
        </ul>
</div>
<div id="opacitybox">

<img src="image/dna_helix.jpg" alt="DNA">
</div>
</div>
<div id="kolumn2">
<h3>Oligo properties calculator</h3>
<br />

<?php
@require_once("./include.php");

if ($_POST['submit']) {
  $textarea = trim($_POST['oligos']);
  if (!ereg("^[atgcATGC \t\n\r]+$",$textarea)) {
    print "<p><b>Bad input.</b><br />\n One oligo sequence should be given on each line and each oligo should be between 15 and 50 bases long.</p>\n";
    print "</body>\n";
    print "</html>\n";
    die;
  }
  print "<table border=1 cellpadding=2>\n";
  print "<tr><td><b>Sequence</b></td><td><b>GC&nbsp;[%]</b></td><td><b>Tm&nbsp;[&deg;C]</b></td><td><b>Hairpin</b></td><td><b>Dimer</b></td></tr>\n";
  $textarea = ereg_replace("[ \t\r]", "", strtoupper($textarea));
  $textarea = explode("\n", $textarea);
  $goodoligos = 0;
  foreach ($textarea as $oligo) {
		echo "oligo";
		print $oligo;
    if (ereg("^[ATGC]{15,50}$",$oligo)) { // Drop too short and too long ones.
		      $gc = gc_cont($oligo);
		      $tm = temp_m($oligo);
		      $hairpin = hairpin($oligo);
		      $dimer = dimer($oligo, $oligo);
		      if ($hairpin>-3) {
			$hairpintext = "<font color=\"green\">Not&nbsp;likely</font>";
		      } else if ($hairpin>-5) {
			$hairpintext = "<font color=\"orange\">Somewhat&nbsp;likely</font>";
		      } else {
			$hairpintext = "<font color=\"red\">Likely</font>";
		      }
		      if ($dimer>-6) {
			$dimertext = "<font color=\"green\">Not&nbsp;likely</font>";
		      } else if ($dimer>-8) {
			$dimertext = "<font color=\"orange\">Somewhat&nbsp;likely</font>";
		      } else {
			$dimertext = "<font color=\"red\">Likely</font>";
		      }
		      if ($tm<52) {
			$tmcolour = "blue";
		      } else if ($tm>62) {
			$tmcolour = "red";
		      } else {
			$tmcolour = "green";
		      }
      printf("<tr><td>%s</td><td>%d</td><td><font color=\"%s\">%.1f</font></td><td>%s</td><td>%s</td></tr>\n", $oligo, $gc*100, $tmcolour, $tm, $hairpintext, $dimertext);
      $goodoligos++;
    }
    if ($goodoligos>=100) {
      break;
    }
  }
  print "</table>\n";
  if ($goodoligos>=100) {
    print "<p><b>Note:</b> The number of oligos to be checked in one go is limited to 100. Only the first 100 oligos are presented here.</p>\n";
  }
} else {
  print "<p>\nThe oligo properties calculator will calculate the melting temperature and GC contents of an oligonucleotide and whether it is likely to form hairpins or self dimers.<br />It is of course important for the PCR reaction to have primers with the correct temperature that do not form hairpins or dimers. Using good oligos as input to the Webtag also makes it more likely to find good tags fast and not time out.\n</p>\n";
  printf("<form action=\"%s\" method=\"POST\">\n", $_SERVER['PHP_SELF']);
  print "<h5>Enter oligo sequences:</h5>\n";
  print "<textarea name=\"oligos\" cols=40 rows=20>";
  print "</textarea><br />\n";
  print "<p><input type=\"submit\" name=\"submit\" value=\"Calculate\"></p>\n";
  print "</form>\n<br />";
}
?>

</div>
</div>
<div id="sidfot">&copy;-2007 <a href="mailto:webmaster@artedi.ebc.uu.se">Webmaster</a> This page was last 
updated:<?php
$andrad = date("Y-m-d H:i:s", getlastmod());
print " $andrad<br />\n";
?>
</div>
</div>
</body>
</html>
