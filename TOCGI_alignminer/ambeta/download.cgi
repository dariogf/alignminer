#!/usr/bin/perl -wT

use CGI ':standard';
use CGI::Carp qw(fatalsToBrowser); 

use lib '/srv/www/cgi-bin/alignminer/lib';

use File::Basename;

use alignminerCGI_h qw(:All);



my @fileholder;
my $files_location = $UPLOAD_BASE_DIR;

# my $USER = param('USER');
# my $IDRUN = param('IDRUN');
my $FILENAME = param('F');

if ($FILENAME eq '') { 
  print "Content-type: text/html\n\n"; 
  print "You must specify a file to download."; 
} else {

  open(DLFILE, "<$files_location$FILENAME") || Error('open', 'file:'."$files_location$FILENAME");
  @fileholder = <DLFILE>; 
  close (DLFILE) || Error ('close', 'file'); 

	my $NOMBRE = basename($files_location.$FILENAME);
	
  # open (LOG, ">>/webdata/public_html/test.log") || Error('open', 'file');
  # print LOG "$FILENAME\n";
  # close (LOG);
#  print "Content-Type:application/x-download\n\n";
  print "Content-Type:application/x-download\n";
  print "Content-Disposition:attachment;filename=$NOMBRE\n\n";
  print @fileholder;
}

sub Error {
      print "Content-type: text/html\n\n";
	print "The server can't $_[0] the $_[1]: $! \n";
	exit;
}
