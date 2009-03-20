
=head1 NAME

Utils::Printing - Impresión de tipos de datos complejos en pantalla

=head1 SYNOPSIS

    use Utils::Printing;
    
=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

=cut

package Utils::Printing;

use strict;
use warnings;

use alignminer_h qw(:All);

use Exporter;
use vars qw($VERSION @ISA @EXPORT @EXPORT_OK %EXPORT_TAGS);

$VERSION     = "v 0.01";
@ISA         = qw(Exporter);
@EXPORT      = ();
@EXPORT_OK   = qw(  
                    printArray
                    printArrayOfHash
                    printHash
                    printHashOfArray
                    printHashOfHash
                );

%EXPORT_TAGS = ( All => [qw(  
                            printArray
                            printArrayOfHash
                            printHash
                            printHashOfArray
                            printHashOfHash
                        )]);


#-----------------------------------------------------------------------------#

=head2 printArray

 Title   : printArray
 Usage   : printArray();
 
 Function: Imprime un Array y su tamaño

 Returns : 
 Args    : $name = nombre
           @a = elemento a imprimir

=cut

#-----------------------------------------------------------------------------#
sub printArray {
    (my $name, my @a) = @_;
    my $ac=($#a+1);
    
    # imprime nombre y tamaño
    print "$name($ac)=\n[";
    print @a;
        
    print "]\n";
}#printArray

#-----------------------------------------------------------------------------#

=head2 printArrayOfHash

 Title   : printArrayOfHash
 Usage   : printArrayOfHash($name,@array);
 
 Function: description

 Returns : returns
 Args    : arguments

=cut

#-----------------------------------------------------------------------------#
sub printArrayOfHash {
    (my $name, my @a) = @_;
    
    my $i = 0;
    
    foreach my $e (@a) {
        printHash("$i",%{$e});
        $i++;
    }
    
}#printArrayOfHash


#-----------------------------------------------------------------------------#

=head2 printHash

 Title   : printHash
 Usage   : printHash();
 
 Function: Imprime un Hash

 Returns : 
 Args    : $name = nombre
           @a = elemento a imprimir

=cut

#-----------------------------------------------------------------------------#
sub printHash {
    (my $name,my %h) = @_;
    
    print "\n\%$name is:\n";

      foreach my $k (sort keys %h) {
          my $v = $h{$k};

          print "$k=>$v\n";
      }
      print "\n\n";
    
}#printHash

#-----------------------------------------------------------------------------#

=head2 printHashOfArray

 Title   : printHashOfArray
 Usage   : printHashOfArray();
 
 Function: Imprime un Hash de Arrays y sus tamaño

 Returns : 
 Args    : $name = nombre
           @a = elemento a imprimir

=cut

#-----------------------------------------------------------------------------#
sub printHashOfArray {
    (my $name,my %hoa) = @_;
    
    print "\n\%$name is:\n";
    
    foreach my $k (sort keys %hoa) {
      my @a = @{ $hoa{$k} };
      # my $ac=($#a+1);
      printArray($k,@a);
      # print "$k($ac)=>\n[";
      # print @a;
      # print "]\n\n";
    }
    
}

#-----------------------------------------------------------------------------#

=head2 printHashOfHash

 Title   : printHashOfHash
 Usage   : printHashOfHash();
 
 Function: Imprime un Hash de hashes y su tamaño

 Returns : 
 Args    : $name = nombre
           @a = elemento a imprimir

=cut

#-----------------------------------------------------------------------------#
sub printHashOfHash {
    (my $name,my %hoh) = @_;
    
    print "\n\%$name is:\n";

      foreach my $k (sort keys %hoh) {
          my %h = %{ $hoh{$k} };
          
          printHash($k,%h);

      }
    
}#printHashOfHash

1;