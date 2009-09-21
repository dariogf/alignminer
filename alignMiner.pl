#!/usr/bin/perl -w
### param1 param2

# TODO - Repasar restricciones regiones


# Dario Guerrero
# =======================
# v0.1  -  18-02-2007


=head1 NAME

alignMiner - Algoritmo de detección de información en alineamientos

=head1 REQUISITES

    -Log::Log4perl : cpan> install -f Log::Log4perl
    -Bioperl
    
    **** NO -gnuplot (necesita libgd para png) http://sourceforge.net/project/showfiles.php?group_id=2888&package_id=237839&release_id=563686
    ### poner esto en bash_profile si no anda el aquaterm: export GNUTERM=X11
    
    **** NO -Template: cpan> install Template
    
    -JSON: cpan> install JSON
    
    -Math:FFT

=head1 SYNOPSIS


=head1 DESCRIPTION


=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos internos y privados comienzan con "_".

=cut

use strict;
use File::Basename;

# cambiar esto para despliegue
# use lib '/Volumes/Documentos/Progs/bio/AlignMiner';
# use lib '/usr/local/alignminer';

#use lib '/export/home_users/home/soft/bioperl/alignminer/';
use lib dirname($0);

print $0;

# librerias bio
use Bio::AlignIO;
# use Bio::Align::AlignI;


# para permitir loggin
use Log::Log4perl qw(:easy);

use File::Path;

use Utils::Printing qw(:All);

use AM::TAlignSetAM;

use AM::TCountAM;

use alignminer_h qw(:All);


# ====================================================
# ===================== CONSTANTES ===================
# ====================================================

# ====================================================
# =============== PROTIPOS FUNCIONES =================
# ====================================================

# ====================================================
# ====================== MAIN ========================
# ====================================================

# ASK-DONE - EXPORTACION DE DATOS JSON CON MUCHOS DECIMALES, no sirve

# ASK-DONE -Ver mean vs median en MAD
# ASK-DONE -En Tabla frecuencias para f3:
# TODO-DONE -Calcular los SNP
# TODO-DONE -Interfaz web/AJAX

# TODO - Añadir compresion GZIP a los ficheros json para el envío. Bien en download o al guardarlos.
# TODO-DONE -Resultados regiones ordenados por SCORE
# TODO-DONE -Tablas de regiones clicables
# TODO-DONE -Dar feedback de gráfica actual.
# TODO-DONE -Dar feedback de region actual.
# TODO -limpiar interfaz al hacer click en send.
# TODO -Guardar resultados en ficheros.
# TODO-DONE -Filtrar regiones CONVfft Y DIVfft dependiendo de si tienen CONV/DIV normales dentro.


# ASK-DONE -¿Como es posible que en una gráfica de similitud f1 existan trozos positivos (eg alineamientoclustal)? Si todas las bases fuesen iguales, el valor debería ser 0, y negativo si hay diferencias.

# ASK -Pedir alineamientos que ya hayan sido estudiados a mano y se hayan extraído los SNP y regiones para poder hacer pruebas.

# SHOW-DONE -Mostrar SNPs
# SHOW-DONE -Mostrar web
# SHOW-DONE -Mostrar exportación JSON para AJAX

# SHOW-DONE -EJS char - http://www.ejschart.com/

# recibe los parametros
my $inputfilename="";

# $inputfilename = "/Volumes/Documentos/Progs/bio/AlignMiner/alignments/adn";

# $inputfilename = "alignments/gogat";

# alineamiento 500.000
# $inputfilename = "alignments2/larguisimo.msf";
# $inputfilename = "alignments2/medio.msf";

# dna buena grafica f3
# $inputfilename = "alignments2/alineamientoClustal.msf"; 

# alineamiento rarisimo
# $inputfilename = "alignments2/alineamientoMauve.aln"; 

# alineamiento rarisimo
# $inputfilename = "alignments2/patatas_ClustalW.msf"; 

# if ($inputfilename eq "") {
    my $argc = $#ARGV+1;
    
    my $mode = 'COMPLETE';
    
    my $alignment_start = 0;
    my $alignment_end = 0;

    # si no hay parametros mostrar info
    if (!($argc == 9)) {
        print("Usage: \n#>".basename($0)." filename USERID RUNID MASTER JOBNAME REAL_FILENAME ALIGNMENT_START ALIGNMENT_END (QUICKINFO|COMPLETE)\n\n");
        exit;
    }
    
    #print "Base dir:".$UPLOAD_BASE_DIR;
    
    $inputfilename=$ARGV[0];

    $USERID = $ARGV[1];
    
    # run ID viene del padre
    $RUNID = $ARGV[2];
    
    my $MASTER=$ARGV[3];
    
    my $JOBNAME = $ARGV[4];
    my $REAL_FILENAME= $ARGV[5];
    
    $alignment_start = $ARGV[6];
    $alignment_end = $ARGV[7];
    
    $mode = $ARGV[8];
# }
# 
# # obtener un numero unico para identificar el proceso
# my $time = time; 
# 
# # identificador unico de la ejecucion con el tiempo y el pid de la ejecución actual
# $RUNID = $time . $$;

# print "Run ID : $runId";

$OUTPUT_DIR = "$BASE_OUTPUT_DIR$USERID/$RUNID/";

$GRAPH_OUTPUT_DIR = $OUTPUT_DIR.'graphs/';
$DATA_OUTPUT_DIR = $OUTPUT_DIR.'data/';
$JSON_OUTPUT_DIR = $OUTPUT_DIR.'json/';
$MATLAB_OUTPUT_DIR = $OUTPUT_DIR.'matlab/';

mkpath([$OUTPUT_DIR,$GRAPH_OUTPUT_DIR,
$JSON_OUTPUT_DIR,
$DATA_OUTPUT_DIR,
$MATLAB_OUTPUT_DIR]);

# Establece un logger
my $logger;

my $logFileName='log.txt';

if ($mode eq "QUICKINFO") {
    $logFileName='quicklog.txt';
}

$logger = setupLogging($OUTPUT_DIR.$logFileName);

$logger->info("Starting execution: $USERID, $RUNID, $MASTER, $JOBNAME, $REAL_FILENAME, $mode");

$logger->info("AlignMiner version: $AMVERSION");


# nuevo objeto de alineamientos
my $alignSetAM = AM::TAlignSetAM->new($inputfilename);

# my $procesedAlignments = 0;
# # para cada alinemamiento
# while ( my $alignAM = $alignSetAM->next_aln()) {
# 
#   $procesedAlignments++;
#   $logger->info("Processing alignment #".$procesedAlignments);
# 
#   # procesar el alineamiento
#   $alignAM->process();
#   
# }

# Procesa un alineamiento (no se usan ficheros con varios aln)
my $alignAM = $alignSetAM->next_aln();

# procesar el alineamiento
if ($mode eq "QUICKINFO") {
  
    $logger->info("Extracting quick alignment info");
    $alignAM->getQuickInfo($alignSetAM->format);
    $alignAM->qInfo()->{'jobName'} = $JOBNAME;
    # $alignAM->qInfo()->{'master'} = $MASTER;
    $alignAM->qInfo()->{'fileName'} = $REAL_FILENAME;
    $alignAM->saveQuickInfo();
    
}else{ # COMPLETE MODE
    
    $logger->info("Processing alignment");
    
    $alignAM->getQuickInfo($alignSetAM->format);
    
    # $alignAM->qInfo()->{'jobName'} = $JOBNAME;
    $alignAM->qInfo()->{'master'} = $MASTER;
    
    
    
    # slice the alignment
    if ((($alignment_start>0) or ($alignment_end>0)) and ($alignment_end>$alignment_start)){
      $alignment_start= 0 if $alignment_start<0;
      $alignment_end= $alignAM->alignment->length if ($alignment_end<=0 or $alignment_end>$alignAM->alignment->length);
      
      # TODO - SLICE ALIGNMENT
      $alignAM->slice_alignment($alignment_start,$alignment_end);
      
      # TODO - comprobar que no se hace el slice dos veces sobre el fichero alignment.json
      
    }else{

      # automatic slice
      $alignAM->slice_alignment(0,0);
      
    }
    
    $alignAM->qInfo()->{'alignment_start'} = $alignment_start;
    $alignAM->qInfo()->{'alignment_end'} = $alignment_end;
    
    # $alignAM->qInfo()->{'fileName'} = $REAL_FILENAME;
    $alignAM->saveQuickInfo();
    
    $alignAM->process();

    # borrar fichero RUNNING, indicando que ya se ha finalizado la ejecucion
    if (-e "$OUTPUT_DIR$RUNNING_FILE") {
      unlink "$OUTPUT_DIR$RUNNING_FILE" or die "Cannot rm $OUTPUT_DIR$RUNNING_FILE";
    }
    
    my $resultSize = `/usr/bin/du -sh "$OUTPUT_DIR" | /usr/bin/cut -f 1`;
    
    $alignAM->qInfo()->{'resultSize'} = $resultSize;
    $alignAM->saveQuickInfo();
    
}

$logger->info("The END.");

# ====================================================
# ====================== SUBS ========================
# ====================================================

# ===================================================
# Activa el loggin
# ===================================================
sub setupLogging {
    # Solo a pantalla
    # Log::Log4perl->easy_init($DEBUG);
    my ($fn) = @_;
    
    # A fichero
    Log::Log4perl->easy_init( { level   => $DEBUG,
                                file    => ">>$fn" } );

    # Configuracion avanzada de logging

    # my $conf = q(
    #     log4perl.logger                    = ERROR, FileApp
    #     log4perl.appender.FileApp          = Log::Log4perl::Appender::File
    #     log4perl.appender.FileApp.filename = 'file.log'
    #     log4perl.appender.FileApp.layout   = PatternLayout
    #     log4perl.appender.FileApp.layout.ConversionPattern = %d> %m%n
    # );
    
    # Log::Log4perl->init( \$conf );

    return get_logger();

}

