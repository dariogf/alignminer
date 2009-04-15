# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

Módulo para variables globales - Contiene las variables globales del sistema 

=head1 SYNOPSIS

    use alignminer_h qw(:All);

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

package alignminer_h;

use strict;
use warnings;


use Exporter;
use vars qw($VERSION @ISA @EXPORT @EXPORT_OK %EXPORT_TAGS);

$VERSION     = "v 0.01";
@ISA         = qw(Exporter);
@EXPORT      = ();
@EXPORT_OK   = qw(
                $AMVERSION
                $USERID
                $RUNID
                $BASE_OUTPUT_DIR
                $OUTPUT_DIR
                $GRAPH_OUTPUT_DIR
                $JSON_OUTPUT_DIR
                $DATA_OUTPUT_DIR
                $MATLAB_OUTPUT_DIR
                $GNUPLOT_GRAPH_SCRIPT
                $MATRIX_FOLDER
		            $ALIGNMINER_INSTALL_DIR
		            $GNUPLOT_PATH
		            $RUNNING_FILE
                $SUBMITTED_FILE
                );

%EXPORT_TAGS = ( All => [qw(                
                            $AMVERSION
                            $USERID
                            $RUNID
                            $BASE_OUTPUT_DIR
                            $OUTPUT_DIR
                            $GRAPH_OUTPUT_DIR
                            $JSON_OUTPUT_DIR
                            $DATA_OUTPUT_DIR
                            $MATLAB_OUTPUT_DIR
                            $GNUPLOT_GRAPH_SCRIPT
                            $MATRIX_FOLDER
                            $ALIGNMINER_INSTALL_DIR
			                      $GNUPLOT_PATH
			                      $RUNNING_FILE
			                      $SUBMITTED_FILE
                        )]);

our $AMVERSION = '104';

# our $BASE_OUTPUT_DIR = '/srv/www/htdocs/alignminer/tmpdata/';
our $BASE_OUTPUT_DIR= '/export/home_users/home/soft/bioperl/tmpdata/';

our $USERID = 'ANONYMOUS';
our $RUNID = 0;
our $OUTPUT_DIR = $BASE_OUTPUT_DIR;
our $ALIGNMINER_INSTALL_DIR = '/export/home_users/home/soft/bioperl/alignminer/';

our $RUNNING_FILE ='IS_RUNNING';
our $SUBMITTED_FILE ='IS_SUBMITTED';


our $GRAPH_OUTPUT_DIR = $OUTPUT_DIR.'graphs/';
our $DATA_OUTPUT_DIR = $OUTPUT_DIR.'data/';
our $JSON_OUTPUT_DIR = $OUTPUT_DIR.'json/';
our $MATLAB_OUTPUT_DIR = $OUTPUT_DIR.'matlab/';

# our $GNUPLOT_GRAPH_SCRIPT = '/Volumes/Documentos/Progs/bio/AlignMiner/graphs/mkgraph.sh';
our $GNUPLOT_GRAPH_SCRIPT = $ALIGNMINER_INSTALL_DIR.'graphs/mkgraph.sh';

our $GNUPLOT_PATH = '/usr/local/bin/gnuplot';

# FIXME-DONE - cambiar las matrices para que lean desde este path
# our $MATRIX_FOLDER = '/Volumes/Documentos/Progs/bio/AlignMiner/matrix/';

our $MATRIX_FOLDER = $ALIGNMINER_INSTALL_DIR.'matrix/';



#-----------------------------------------------------------------------------#

1;  # so the require or use succeeds
