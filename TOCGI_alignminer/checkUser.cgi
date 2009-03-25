#!/usr/bin/perl -wT

# Obtener el estado de un trabajo

use strict;
use warnings;

use CGI;

# TODO - QUITAR ESTO EN VERSION FINAL, solo para debug.
use CGI::Carp qw(fatalsToBrowser);

use JSON;

#-----------------------------------------------------------------------------#

# BEGIN

BEGIN {
    # configurar variables globales de CGI.pm
  # disable uploads
  $CGI::DISABLE_UPLOADS = 1;

  # depurado del programa
  #(eliminar al finalizar la fase de correccion de errores)
#  $|=1; # forces buffer flushing
#  print "Content-type: text/html\n\n",
#        "warning: still using CGI::Carp('fatalsToBrowser') <br>\n",
#        "USE ONLY ON DEBUG <br>\n";
#  use CGI::Carp('fatalsToBrowser', 'warningsToBrowser');
#  warningsToBrowser(1);
} #BEGIN


#-----------------------------------------------------------------------------#

my %res; # array de resultados


my $cgi = CGI->new();             # objeto CGI

my $_userId = $cgi->param('USERID');
# my ($userId) = ($_userId =~ /^([\w\d\@\-\.]+)$/) if defined $_userId;
my ($userId) = ($_userId =~ /^([\w\d\-\_]+\@[\w\d\-\_\.]+[\w]+)$/) if defined $_userId;


print $cgi->header(-type => 'text/html', -charset => 'utf-8');

$res{'validUser'} = 0;
$res{'processedUserName'} = '';

if ($userId){
  $userId =~ tr/[\@\.\ ]/_/;
  
  $res{'validUser'} = 1;
  $res{'processedUserName'} = $userId;
}

print to_json(\%res);

# print $cgi->end_html();

1;
