#!/usr/bin/perl -w

use CGI ':standard';
use CGI::Carp qw(fatalsToBrowser); 

# use lib '/srv/www/cgi-bin/alignminer/lib';

use File::Basename;

# use alignminerCGI_h qw(:All);

# use lib '/srv/www/cgi-bin/alignminer/lib';
# 
# use alignminerCGI_h qw(:All);

# use JSON;

#-----------------------------------------------------------------------------#

# main
my @dirList = ();                 # lista de directorios de ejecuciones

# my $params='aacccccccccccacccccccc acccccccccccc';                      # numero de la ejecucion
my $params = param('SEQ');

my @res; # array de resultados


my $i;

my $cgi = CGI->new();             # objeto CGI


# print $cgi->header(-type => 'application/text', -charset => 'utf-8');
print $cgi->header(-type => 'text/html', -charset => 'utf-8');

           
# my $res = system('/srv/www/cgi-bin/alignminer/scripts_oligo/oligos.php cagacgtacgtactactactgt cagtcatacactac');

my $cmd = "/usr/bin/php /srv/www/cgi-bin/alignminer/scripts_oligo/oligos.php $params";

# my $res = `/Valignminer/scripts_oligo/oligos.php cagacgtacgtactactactgt cagtcatacactaccacacca`;
my $res = `$cmd`;

# print to_json(\$res);

print $res;

# print $cgi->end_html();

1;
