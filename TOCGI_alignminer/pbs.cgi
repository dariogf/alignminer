#!/usr/bin/perl -wT
use strict;
use warnings;

use CGI;
#-----------------------------------------------------------------------------#

# BEGIN
# configurar variables globales de CGI.pm

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

my $TMPDATA_DIR='/export/home_users/home/soft/bioperl/tmpdata/';

# main
my $cgi = CGI->new();

my $error = $cgi->cgi_error();

$ENV{PATH} = '';
$ENV{ENV} = '';

#my $_username=$cgi->param('ID');
#my ($username) = ($_username =~ /^([\w\d]+)$/) if defined $_username;

my $_id=$cgi->param('id');
my ($id) = ($_id =~ /^([\d]+)$/) if defined $_id;

my $result='';
my $enviaSH='';
my $cmd = '';

#if (($username) and ($id)){

if ($id){

	my $workDir = "$TMPDATA_DIR$id/";
	my $alignmentFile = $workDir."alignment.file";
	
	#crea el fichero enviaPBS.sh
	$enviaSH = saveToEnviaSH($workDir,$alignmentFile,$id);

	#crea el comando
	$cmd="/usr/bin/sudo -u bioperl /usr/pbs/bin/qsub $enviaSH";

	#ejecuta el comando
	$result = `$cmd`;
	#	$result = `/usr/bin/sudo -u bioperl /usr/bin/whoami`;
	
#!system("/bin/qsub /home/bioperl/seqtrim/job1/script.pbs")
#  or $error .= "ERROR=SYSTEM";
}

print $cgi->header(-type => 'text/html', -charset => 'utf-8'),
  $cgi->start_html(-title => 'whoami',
                   -encoding => 'utf-8',),
  $cgi->h1('id:'.$id),                   
  $cgi->h1('cmd,res:'.$cmd.",".$result),
  $cgi->h2('enviaPBS.sh:'.$enviaSH),
  $cgi->end_html();


#================ FUNCIONES ===================

sub saveToEnviaSH {
    
    my ($workDir,$alignment,$id) = @_;
    
    my $filename = $workDir."$id.sh";
    
    open (FILE, ">$filename") or die "error at open $filename";
     
    print FILE '#!/bin/bash',"\n";
		# numero de cpus que empleara el calculo:
		print FILE '#PBS -l select=ncpus=1',"\n";
		
		# memoria que empleara el calculo:
		print FILE '#PBS -l select=mem=2000mb',"\n";
		# si se sabe cuanto va a tardar aproximadamente se debe indicar (10 horas en este caso) :
		print FILE '#PBS -l walltime=10:00:00',"\n";
		
		# para que vaya al directorio actual:
		#print FILE 'cd $PBS_O_WORKDIR',"\n";
		
		print FILE "cd $workDir","\n";
		
		#para darle permisos de lectura a wwwrun:
		print FILE 'umask 0003',"\n";

		# programa a ejecutar, con sus argumentos:
		print FILE "/export/home_users/home/soft/bioperl/alignminer/alignMiner.pl $alignment $id COMPLETE\n";
		
    close(FILE);
    
    return $filename;
    
}#saveToEnviaSH

1;
