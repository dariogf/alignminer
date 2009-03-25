#!/usr/bin/perl -w

# Subir fichero con CGI

use strict;
use warnings;
use Data::Dumper;
use CGI;

# TODO - QUITAR ESTO EN VERSION FINAL, solo para debug.
use CGI::Carp qw(fatalsToBrowser);

# crea un objeto CGI
my $cgi = new CGI;

print $cgi->header;

my $params = $cgi->Vars;


# print $params->{'address'};


# simple procedural interface
print Dumper($params);

# terminar respuesta html
print $cgi->end_html;

system('/usr/bin/logger','parametros cgi',Dumper($params));

#-------------------------------------------------------------

