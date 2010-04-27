#!/usr/bin/perl -wT

# Subir fichero con CGI

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

my $_masterSequence=$cgi->param('MASTER');
my $masterSequence = 'NONE';
($masterSequence)=($_masterSequence =~ /^([\w\d]+)$/) if defined $_masterSequence;

my $_alignment_start = $cgi->param('FALIGNMENT_START');
my $alignment_start=0;
($alignment_start) = ($_alignment_start =~ /^([\d]+)$/) if defined $_alignment_start;

my $_alignment_end = $cgi->param('FALIGNMENT_END');
my $alignment_end=0;
($alignment_end) = ($_alignment_end =~ /^([\d]+)$/) if defined $_alignment_end;

my $master=$masterSequence;

my $jobName='';
my $real_filename='';

my $fileDest = "$UPLOAD_BASE_DIR$userId/$runidcgi/$ALIGNMENT_FILENAME";

    my $respid=undef;
        
    if (!defined ($respid = fork)) { # error
        cgiError($cgi, "Cannot fork: $!");
        

        # terminar respuesta html
        print $cgi->end_html;
        
    } elsif ($respid) { # padre
        
        # terminar respuesta html
        print $cgi->end_html;
        
        # salir
        exit 0;
        
    } else { # hijo

        # open STDIN, '/dev/null'   or die "Cannot read /dev/null: $!";
        # open STDOUT, '>/dev/null' or die "Cannot write to /dev/null: $!";  
    
        # restaura STDERR
        close(STDIN);
        close(STDOUT);
        close(STDERR);
        
        # system('/usr/bin/logger',$ALIGNMINER_EXE,$fileDest,$userId,$runidcgi,'COMPLETE');
        
        # # crear fichero que indique que se estan procesando las seqs mientras exista
        # open my $running_fh, ">$this_dir$RUNNING"
        #   or &error($cgi, "Cannot create $this_dir$RUNNING");
        # close $running_fh;
        # 
        # # borrar fichero, indicando que ya se ha finalizado la ejecucion
        #   if (-e "$this_dir$RUNNING") {
        #     unlink "$this_dir$RUNNING" or die "Cannot rm $this_dir$RUNNING";
        #   }
        
        # crear fichero RUNNING
        open my $submitted_fh, ">$UPLOAD_BASE_DIR$userId/$runidcgi/$RUNNING_FILE"
          or die "Cannot create $UPLOAD_BASE_DIR$userId/$runidcgi/$RUNNING_FILE";
        close $submitted_fh;
        
        if ($USING_BATCH) {
        
          chdir "$UPLOAD_BASE_DIR$userId/$runidcgi";
          
          #crea el fichero enviaPBS.sh
          my $enviaSH = saveToEnviaSH("$UPLOAD_BASE_DIR$userId/$runidcgi/",$fileDest,$userId,$runidcgi,$master, $jobName, $real_filename, $alignment_start ,$alignment_end);

          #crea el comando
          my $cmd="$QSUB_EXE $enviaSH";

          #ejecuta el comando
          my $result = `$cmd`;
          print $result;
          
        }else{
          # lanzar proceso de calculo alignminer, parece que tiene que estar en CGI-Executables o no anda por el -T (tainted)
          system($ALIGNMINER_EXE,$fileDest,$userId,$runidcgi,$master, $jobName, $real_filename,$alignment_start,$alignment_end,0,'COMPLETE');
        }
        
        # terminar respuesta html
        print $cgi->end_html;
        
    # salir
    exit 0;
    
  }

#-------------------------------------------------------------

1;
