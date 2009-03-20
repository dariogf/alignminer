
=head1 NAME

Utils::SaveFiles - Guarda tipos de datos complejos en formato JSON

=head1 SYNOPSIS

    use Utils::SaveJSON;
    
=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

=cut

package Utils::SaveFiles;

use strict;
use warnings;

use alignminer_h qw(:All);

use JSON;

use Exporter;
use vars qw($VERSION @ISA @EXPORT @EXPORT_OK %EXPORT_TAGS);

$VERSION     = "v 0.01";
@ISA         = qw(Exporter);
@EXPORT      = ();
@EXPORT_OK   = qw(  
                    saveToMatlab
                    saveToJSON
                    saveArrayToFile
                    startAddToArrayJSON
                    endAddToArrayJSON
                    addToArrayJSON
                );

%EXPORT_TAGS = ( All => [qw(  
                            saveToMatlab
                            saveToJSON
                            saveArrayToFile
                            startAddToArrayJSON
                            endAddToArrayJSON
                            addToArrayJSON
                        )]);



#-----------------------------------------------------------------------------#

=head2 saveToMatlab

 Title   : saveToMatlab
 Usage   : saveToMatlab($filename,$name,@a);
 
 Function: Guarda en un fichero con formato Matlab

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub saveToMatlab {
    
    my ($filename,$gname,@a) = @_;
    
    open (FILE, ">$filename");
    
    # print "Saving to Matlab ($gname) en ($filename).\n";
    
    # write to file in csv format
    my $i=0;
    my $j="";
    
    print FILE $gname,"=[";
    
    foreach my $e (@a) {
        print FILE $j,$e;
        $j=',';
        $i++;
    }
    
    print FILE "];";
    
    close(FILE);
    
}#saveToMatlab

#-----------------------------------------------------------------------------#

=head2 saveToJSON

 Title   : saveToJSON
 Usage   : saveToJSON($filename,$structref);
 
 Function: Guarda el objeto en formato JSON

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub saveToJSON {

    (my $file,my $a) = @_;
    
    # print "save JSON:$a\n";
        
    open (FILE, ">$file");
    
    my $json_text = to_json($a);
    
    print FILE $json_text;
    
    close(FILE);
    
}#saveToJSON

#-----------------------------------------------------------------------------#

=head2 saveArrayToFile

 Title   : saveArrayToFile
 Usage   : saveArrayToFile($filename,@a);
 
 Function: Guarda el array en un fichero

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub saveArrayToFile {

    
    (my $file,my @a) = @_;
    
    open (FILE, ">$file");
    
    # write to file in csv format
    my $i=0;
    foreach my $e (@a) {
        print FILE $i," ",$e,"\n";
        $i++;
    }
    
    close(FILE);
    
}#saveToFile


#-----------------------------------------------------------------------------#

=head2 startAddToArrayJSON

 Title   : startAddToArrayJSON
 Usage   : $self->startAddToArrayJSON();
 
 Function: Comienza un fichero JSON para añadir las secuencia con addToAlinmentJSON

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub startAddToArrayJSON {
    
    (my $file) = @_;

    # print "save json $file\n";

    open (FILE, ">$file");

    # my $json_text = to_json($a);

    print FILE "[";
    
    close(FILE);

}#startAddToArrayJSON

#-----------------------------------------------------------------------------#

=head2 endAddToArrayJSON

 Title   : stopAddToArrayJSON
 Usage   : stopAddToArrayJSON();
 
 Function: Finaliza un fichero JSON para añadir las secuencia con addToAlinmentJSON

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub endAddToArrayJSON {

    (my $file) = @_;

    # print "save json $file\n";

    open (FILE, ">>$file");

    # my $json_text = to_json($a);

    print FILE "]";
    
    close(FILE);

}#endAddToArrayJSON



#-----------------------------------------------------------------------------#

=head2 addToArrayJSON

 Title   : addToArrayJSON
 Usage   : addToArrayJSON();
 
 Function: añade la secuencia al fichero JSON

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub addToArrayJSON {


    (my $file,my $a,my $last) = @_;

    # print "save json $file\n";

    open (FILE, ">>$file");

    # my $json_text = to_json($a);

    print FILE "\"".$a."\"";
    
    if (!$last){
        print FILE ",";
    }
    
    close(FILE);

}#addToArrayJSON

1;