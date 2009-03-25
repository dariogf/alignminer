#!/usr/bin/perl -wT

# Obtener el estado de un trabajo

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

my $_runidcgi=$cgi->param('FRUNID');
my ($runidcgi) = ($_runidcgi =~ /^(\d+)$/) if defined $_runidcgi;

my $fileDest = "$UPLOAD_BASE_DIR$runidcgi/$ALIGNMENT_FILENAME";

# terminar respuesta html
print $cgi->end_html;


    
#-------------------------------------------------------------

