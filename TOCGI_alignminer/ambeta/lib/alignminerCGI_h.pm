# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

Módulo para variables globales - Contiene las variables globales del sistema 

=head1 SYNOPSIS

    use alignminerCGI_h qw(:All);

    # creando el objeto
    my $var = $VARIABLE_GLOBAL

=head1 DESCRIPTION

Módulo para variables globales: Contiene las variables globales del sistema

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

umask 0002;

package alignminerCGI_h;

use strict;
use warnings;


use Exporter;
use vars qw($VERSION @ISA @EXPORT @EXPORT_OK %EXPORT_TAGS);

$VERSION     = "v 0.01";
@ISA         = qw(Exporter);
@EXPORT      = ();
@EXPORT_OK   = qw(  cgiError
                    saveToEnviaSH
                    $QSUB_EXE
                    $USING_BATCH
                    $UPLOAD_BASE_DIR
                    $ALIGNMENT_FILENAME
                    $ALIGNMINER_EXE
                    $RUNNING_FILE
                    $SUBMITTED_FILE
                );

%EXPORT_TAGS = ( All => [qw(    cgiError
                                saveToEnviaSH
                                $QSUB_EXE
                                $USING_BATCH
                                $UPLOAD_BASE_DIR
                                $ALIGNMENT_FILENAME
                                $ALIGNMINER_EXE
                                $RUNNING_FILE
                                $SUBMITTED_FILE
                        )]);

# our $UPLOAD_BASE_DIR= '/srv/www/htdocs/alignminer/tmpdata/';
our $UPLOAD_BASE_DIR= '/export/home2/home/soft/bioperl/tmpdata/';


our $ALIGNMENT_FILENAME= 'alignment.file';

our $USING_BATCH = 1;

our $ALIGNMINER_EXE = '/export/home2/home/soft/bioperl/ambeta/alignMiner.pl';

our $QSUB_EXE = '/usr/bin/sudo -u bioperl /usr/pbs/bin/qsub';

our $RUNNING_FILE ='IS_RUNNING';
our $SUBMITTED_FILE ='IS_SUBMITTED';


$ENV{PATH} = '';

#-----------------------------------------------------------------------------#

=head2 cgiError - Fusilado de Antonio

 Title   : error
 Usage   : &error($cgi, $warning, $error_status, $msg);
 Function: Imprime el html de error y aborta la ejecucion.
 Returns : Nada.
 Args    : CGI object
           string (warning a mostrar en STDERR para que quede en el log).
           string (error status).
           string (mensaje paara el usuario) opcional.

=cut

sub cgiError {
  my ($cgi, $warn, $error, $msg) = @_;

  warn $warn if defined $warn;

  # si se omite o se deja vacia se muestra el error generico
  $error = 'Internal server error. Try it again later.' unless $error;

  print $cgi->header(-status=>$error, -charset => 'utf-8'),
        $cgi->start_html(-title => '---Error found---',
                         -encoding => 'utf-8'),
        $cgi->h2('Request not processed.'),
        $cgi->h3($error);
  print $cgi->h4($msg) if defined $msg;
  print $cgi->end_html();

  exit 0;
} #error

sub saveToEnviaSH {
    
    my ($workDir,$alignment,$userId,$runId,$master, $jobName, $real_filename) = @_;
    
    my $filename = $workDir."am_$runId.sh";
    
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
		print FILE "$ALIGNMINER_EXE $alignment $userId $runId \"$master\" \"$jobName\" \"$real_filename\" COMPLETE\n";
		
    close(FILE);
    
    return $filename;
    
}#saveToEnviaSH


# sub cgiError {
#   my ($cgi, $warn, $error, $msg) = @_;
# 
#   warn $warn if defined $warn;
# 
#   # si se omite o se deja vacia se muestra el error generico
#   $error = 'Internal server error. Try it again later.' unless $error;
# 
#   print $cgi->header(-status=>$error, -charset => 'utf-8'),
#         $cgi->start_html(-title => '---Error found---',
#                          -encoding => 'utf-8',
#                          -head => $cgi->Link({-rel => 'icon',
#                                               -href => $SEQTRIM_ICO,
#                                               -type => 'image/x-icon'})),
#         $cgi->h2('Request not processed.'),
#         $cgi->h3($error);
#   print $cgi->h4($msg) if defined $msg;
#   print $cgi->end_html();
# 
#   exit 0;
# } #error

1;  # so the require or use succeeds
