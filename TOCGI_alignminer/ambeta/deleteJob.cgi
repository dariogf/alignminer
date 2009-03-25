#!/usr/bin/perl -wT

# borra trabajo de un usuario

use strict;
use warnings;

use File::Path;

use CGI;

# TODO - QUITAR ESTO EN VERSION FINAL, solo para debug.
use CGI::Carp qw(fatalsToBrowser);

use lib '/srv/www/cgi-bin/alignminer/lib';

use alignminerCGI_h qw(:All);

# crea un objeto CGI
my $cgi = new CGI;

print $cgi->header;

my $_userId = $cgi->param('USERID');
my ($userId) = ($_userId =~ /^([\w\d\@\-\.]+)$/) if defined $_userId;

if (!$userId) {
  $userId = "ANONYMOUS";
}

$userId =~ tr/[\@\.\ ]/_/;

my $_runidcgi=$cgi->param('FRUNID');
my ($runidcgi) = ($_runidcgi =~ /^([\w\d_]+)$/) if defined $_runidcgi;

if (($userId) and ($runidcgi)) {
  my $directory = "$UPLOAD_BASE_DIR$userId/$runidcgi/";

  # borra el directorio
  rmtree($directory);
}

# terminar respuesta html
print $cgi->end_html;

# salir
exit 0;

#-------------------------------------------------------------

1;
