#!/usr/bin/perl -wT

# Subir fichero con CGI

use strict;
use warnings;

use File::Copy;
use File::Path;

use CGI;

# TODO - QUITAR ESTO EN VERSION FINAL, solo para debug.
use CGI::Carp qw(fatalsToBrowser);

use lib '/srv/www/cgi-bin/alignminer/lib';

use alignminerCGI_h qw(:All);

# enable uploads
$CGI::DISABLE_UPLOADS = 0;

$CGI::POST_MAX = -1;
# 1024 * 100000;  # límite máximo a subir

# crea un objeto CGI
my $cgi = new CGI;

print $cgi->header;

# comprobar que fichero no excede $CGI::POST_MAX
if (!$cgi->param('inputFile') && $cgi->cgi_error()) {
    
    # Muestra error
    print $cgi->cgi_error();
    print '<p> The file you are attempting to upload exceeds the maximum allowable file size. </p>
<p> Please refer to your system administrator. </p>';
    print $cgi->hr, $cgi->end_html;
    exit 0;
}

# subir el fichero
if ($cgi->param()) {
    save_file($cgi);
}

#-------------------------------------------------------------
sub save_file {
    
    my ($cgi) = @_;
    
    my $_userEmail = $cgi->param('FUSEREMAIL');
    # my ($userEmail) = ($_userEmail =~ /^([\w\d_\-]+\@(\w\d_\-]+\.)+[\w]{2,4})$/) if defined $_userEmail;
    my ($userEmail) = ($_userEmail =~ /^([\w\d\@\-\.]+)$/) if defined $_userEmail;
    
    my $_jobName = $cgi->param('FJOBNAME');
    my ($jobName) = ($_jobName =~ /^([\w\d\s\.\-]+)$/) if defined $_jobName;
    
    if (! defined $jobName){
    	$jobName = ''
    }
    
    
    
    if (!$userEmail) {
      $userEmail = "ANONYMOUS";
    }
    
    $userEmail =~ tr/[\@\.\ ]/_/;
    
    # if ($jobName) {
    #   $jobName =~ tr/[\.\ ]/_/;
    # }
    
    # obtener un numero unico para identificar el proceso
    my $time = time;
    # identificador unico de la ejecucion con el tiempo y el pid de la ejecución actual
    my $runidcgi=$time . $$;
    
    
    my $_fileHandle = $cgi->upload('inputFile');
    
    
    my $master='NONE';
    my $alignment_start = '0';
    my $alignment_end = '0';
    
    my $_real_filename = $cgi->param('inputFile');
    my ($real_filename)= ($_real_filename =~ /^([\w\d\s\.\-]+)$/) if defined $_real_filename;

    
    my $ACTUAL_BASE_DIR="$UPLOAD_BASE_DIR$userEmail/$runidcgi/";
        
    # my $fileDest = "$UPLOAD_BASE_DIR$runidcgi/$ALIGNMENT_FILENAME";
    my $fileDest = "$ACTUAL_BASE_DIR$ALIGNMENT_FILENAME";
    
    # crea el directorio de destino
    mkpath("$ACTUAL_BASE_DIR");
    #my $cmd ='/usr/bin/sudo -u bioperl /bin/mkdir -p '.$ACTUAL_BASE_DIR; 
    #system($cmd);

    # copia el fichero
    copy($_fileHandle, "$fileDest")
      or cgiError($cgi, "Cannot copy submitted file to $fileDest");
    
    my $respid=undef;
        
    if (!defined ($respid = fork)) { # error
        cgiError($cgi, "Cannot fork: $!");
    } elsif ($respid) { # padre
        
        # recordar que este codigo va dentro de un iframe independiente del form principal.
        # por eso hay que usar window.top.
        # print '<script language="javascript" type="text/javascript"> window.top.window.run.finishedUpload(1,"'.$runidcgi.'","'.$userEmail.'","'.$jobName.'"); </script>';
        print '<script language="javascript" type="text/javascript"> window.top.window.uploadFinished(1,"'.$runidcgi.'","'.$userEmail.'","'.$jobName.'"); </script>';

          
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
	
  	    #my $cmd ='/bin/chown -R bioperl:gbioperl '.$ACTUAL_BASE_DIR;
      	#system($cmd);

        #system('/bin/chown', '-R', 'bioperl:gbioperl', $ACTUAL_BASE_DIR); 

        #system('/usr/bin/logger',$ALIGNMINER_EXE,$fileDest,$userEmail,$runidcgi,'QUICKINFO');
        
        # lanzar proceso de calculo alignminer, tiene que estar en CGI-Executables o no anda por el -T (tainted)
        system($ALIGNMINER_EXE,$fileDest,$userEmail,$runidcgi,$master, $jobName, $real_filename,$alignment_start,$alignment_end,"QUICKINFO");


# terminar respuesta html
      # print $cgi->end_html;

    # salir
    exit 0;


  }
        
}

#-------------------------------------------------------------

1;
