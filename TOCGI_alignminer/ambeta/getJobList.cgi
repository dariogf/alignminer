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

# main
my @dirList = ();                 # lista de directorios de ejecuciones

my $id;                      # numero de la ejecucion

my @res; # array de resultados


my $i;

my $cgi = CGI->new();             # objeto CGI

# my $error = $cgi->cgi_error();
# &error($cgi, $error) if $error;

# my $_remote_host = $cgi->http('HTTP_X_FORWARDED_FOR');
# my ($remote_host) = ($_remote_host =~ /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/)
#   if defined $_remote_host;
# if (!defined $remote_host) {
#   $_remote_host = $cgi->remote_host();
#   ($remote_host) = ($_remote_host =~ /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/)
#     if defined $_remote_host;
# }

my $_userId = $cgi->param('USERID');
my ($userId) = ($_userId =~ /^([\w\d\@\-\.]+)$/) if defined $_userId;

$userId =~ tr/[\@\.\ ]/_/;



my $USER_DIR = "$UPLOAD_BASE_DIR$userId/";

# # URL del link a cada ejecucion
# my $base_summary_link = "$SUMMARY_LINK?run_num=";

# obtiene todos los elementos del directorio de ejecuciones
if (opendir(DIRH, $USER_DIR)) {
  @dirList = sort {$b cmp $a} readdir(DIRH);
  closedir DIRH;
}



# print $cgi->header(-type => 'application/text', -charset => 'utf-8');
print $cgi->header(-type => 'text/html', -charset => 'utf-8');

$i = 0;

# para cada directorio muestra una fila de la tabla
foreach my $dir (@dirList) {
  
  # si el directorio existe
  if ($dir !~ /^\./ && -d "$USER_DIR$dir") {
    
    my %jobData;

    # extraer el numero
    ($id) = ($dir =~ /(\d*)$/);
    
    # nombre del fichero info actual
    my $qInfoFile = $USER_DIR."$id/json/alignInfo.json";
    
    
    $jobData{'id'} = $id;
    $jobData{'status'}= 'WAITING';
        
    # existe el fichero de informacion rápida
    if (-e $qInfoFile) {
      
      $jobData{'status'}='WAITING RUN';
      
      # lee fichero con  qinfo del align
      open my $qinfo_fh, "$qInfoFile"
        or die "Cannot open $qInfoFile";
      my $qit = <$qinfo_fh>;
      my $qinfo = from_json($qit);
      close $qinfo_fh;
      
      $jobData{'qinfo'} = $qinfo;
      
      # si existe el fichero run es que ha sido mandado a run
      if (-e ("$USER_DIR$id/$RUNNING_FILE")) {
        
        # si no existe el stagesDone, es porque está encolado
        if (defined($qinfo->{'stagesDone'}) and ($qinfo->{'stagesDone'} >0)) {
          $jobData{'status'}='RUNNING';
        }else{
          $jobData{'status'}='QUEUED';
        }
      }else{ # no existe el fichero run
        # si ha llegado al final
        if (defined($qinfo->{'stagesCount'}) and ($qinfo->{'stagesCount'} == $qinfo->{'stagesDone'})) {
          $jobData{'status'}='DONE';
        }
      }
    }
    
    
    # no existe el de running
    
    # if ((!(-e ("$USER_DIR$id/$RUNNING_FILE"))) and (logHasTheEnd("$USER_DIR$id/log.txt"))) {
    #       $jobData{'status'}='DONE';
    # }    
    
    # guarda hash en array de resultados como ref
    push(@res,\%jobData);
    
    
    # $ref_params = &xml2params($cgi, "$USER_DIR$dir/$PARAMS_XML_FILE");

    # if ($ref_params->{remote_host} eq $remote_host) {
    #   if ((-e "$DIR$read/$ERROR_LOG" && -s "$DIR$read/$ERROR_LOG") ||
    #       (-e "$DIR$read/$BLAST_ERR_FILE" && -s "$DIR$read/$BLAST_ERR_FILE")) {
    #     $is_running = 'Corrupted';
    #   } elsif (-e "$DIR$read/$RUNNING") {
    #     $is_running = $cgi->font({-color => 'red'}, 'Running');
    #     $refresco = 1;
    #   } else {
    #     $is_running = $cgi->b('Completed');
    #   }
    # 
    #   # selecciona color de fondo
    #   if ($i % 2 == 0) {
    #     $color = 'silver';
    #   } else {
    #     $color = '#E7E7E7';
    #   }
    #   $i++;
    # 
    #   # cuenta el numero de secuencias
    #   $num_seqs = '---';
    #   $num_seqs = $ref_params->{num_seqs} if exists $ref_params->{num_seqs};
    # 
    #   # define la etiqueta, si no existe se toma como etiqueta el run_num
    #   if (exists $ref_params->{label} && defined $ref_params->{label}) {
    #     $label = $ref_params->{label};
    #   } else {
    #     $label = $run_num;
    #   }
    # 
    #   print $cgi->Tr({-bgcolor => $color, -align => 'center'},
    #           $cgi->td(
    #               [$cgi->a({-href => "$base_summary_link$run_num"}, $label),
    #               $ref_params->{date},
    #               $num_seqs,
    #               $is_running,
    #               &seqtrim_remove($cgi, $run_num)]));
    # }
  }
}

print to_json(\@res);

# print $cgi->end_html();

1;
