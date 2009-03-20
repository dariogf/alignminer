
=head1 NAME

Utils::Printing - Impresión de tipos de datos complejos en pantalla

=head1 SYNOPSIS

    use Utils::Printing;
    
=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

=cut

package Utils::Stats;

use strict;
use warnings;

use Utils::Printing qw(:All);

use alignminer_h qw(:All);

use Exporter;

use vars qw($VERSION @ISA @EXPORT @EXPORT_OK %EXPORT_TAGS);

$VERSION     = "v 0.01";
@ISA         = qw(Exporter);
@EXPORT      = ();
@EXPORT_OK   = qw(  log_2
                    mad_median
                    mad_mean
                    median
                    rmad
                );

%EXPORT_TAGS = ( All => [qw(
                            log_2
                            mad_median
                            mad_mean
                            median
                            rmad
                        )]);

#-----------------------------------------------------------------------------#

=head2 log_2

 Title   : log_2
 Usage   : my $log_base_2 = log_2();
 
 Function: Calcula el logaritmo en base 2 de un número

 Returns : Escalar numérico con el valor del logaritmo base 2
 Args    : Escalar numérico al que calcular el logaritmo base 2

=cut

#-----------------------------------------------------------------------------#
sub log_2 {
    (my $n) = @_;
    
    return (log($n) / log(2));
}


#-----------------------------------------------------------------------------#

=head2 mad_mean

 Title   : mad_mean
 Usage   : my ($mad,$median) = mad_mean();
 
 Function: Calcula la mad de un aray: mean(abs(X-mean(X))

 Returns : mad(x) y median(x).
 Args    : Array de entrada.

=cut

#-----------------------------------------------------------------------------#
sub mad_mean {
    (my @a) = @_;
    
    # mad = median(|xi-median(X)|);
    
    # print "a=[".join(',',@a)."]\n";
    
    # calcula media
    my $mx=mean(@a);
    
    
    # calcula aux con la resta y el abs
    my @aux;
    foreach my $e (@a) {
        push(@aux,(abs($e-$mx)));
    }
    
    # print "aux=[".join(',',@aux)."]\n";
    
    # calcula la media del array anterior;
    my $ma=mean(@aux);
        
    # print "ma: $ma,mx:$mx\n";
    
    return ($ma,$mx);
    
}#mad_mean

#-----------------------------------------------------------------------------#

=head2 mad_median

 Title   : mad_median
 Usage   : my ($mad,$median) = mad_median();
 
 Function: Calcula la mad de un aray: median(abs(X-median(X))

 Returns : mad(x) y median(x).
 Args    : Array de entrada.

=cut

#-----------------------------------------------------------------------------#
sub mad_median {
    (my @a) = @_;
    
    # mad = median(|xi-median(X)|);
    
    # print "a=[".join(',',@a)."]\n";
    
    # calcula mediana
    my $mx=median(@a);
    
    
    # calcula aux con la resta y el abs
    my @aux;
    foreach my $e (@a) {
        push(@aux,(abs($e-$mx)));
    }
    
    # print "aux=[".join(',',@aux)."]\n";
    
    # calcula la mediana del array anterior;
    my $ma=median(@aux);
    
    # return $mx-$ma;
    
    # print "ma: $ma,mx:$mx\n";
    
    return ($ma,$mx);
    
}#mad
#-----------------------------------------------------------------------------#

=head2 Rmad

 Title   : Rmad
 Usage   : my ($mad,$median) = Rmad();
 
 Function: Calcula la mad de un array restringiendo los puntos: median(abs(X-median(X))

 Returns : mad(x) y median(x).
 Args    : Array de entrada.

=cut

#-----------------------------------------------------------------------------#
sub rmad {
    my ($gname,@a1) = @_;
    
    # my @a;
    # 
    # foreach my $e (@a1) {
    #     if (($e<-0.03) or ($e>0.03)) {
    #         push(@a,$e);
    #     }
    # }
    
    # print "calculando RMAD:$gname\n";
    
    # mad = median(|xi-median(X)|);
    
    # print "a=[".join(',',@a1)."]\n";
    
    # calcula median(x);
    my $mx=median(@a1);
    # my $mx=mean(@a1);
    
    
    # quita los ceros
    my @a;
    
    foreach my $e (@a1) {
        if (($e<-0.001) or ($e>0.001)) {
            push(@a,$e);
        }
    }
    
    # calcula aux con la resta y el abs
    my @aux;
    
    foreach my $e (@a) {
        push(@aux,(abs($e-$mx)));
    }
    
    saveToMatlab("$MATLAB_OUTPUT_DIR".$gname.".m",$gname,@a);
    
    # print "aux=[".join(',',@aux)."]\n";
    
    # calcula la median del array anterior;
    my $ma=median(@aux);
    # my $ma=mean(@aux);
    
    
    # return $mx-$ma;
    
    # print "rmad: $ma,mx:$mx\n";
    
    return ($ma,$mx);
    
}#RMad


#-----------------------------------------------------------------------------#

=head2 median

 Title   : median
 Usage   : my $value = median();
 
 Function: Calcula la mediana de un array de elementos numéricos

 Returns : Escalar con la mediana
 Args    : Array de valores numéricos

=cut

#-----------------------------------------------------------------------------#
sub median {
    # hay que ordenar como número y no como string
    (my @a) = sort { $a <=> $b } @_;
    
    # entra el array ordenado
    
    
    # print join(' ',@a);
    my $med;
    
    if ($#a % 2) { 
        # print "par";
        # (a b c d)
        # med= b+(c-b)/2;
        
        $med = $a[int($#a / 2)] + (($a[int($#a / 2) + 1] - $a[int($#a / 2)]) / 2);
    } else {
        # print "impar";
        # es el valor de enmedio del array ordenado
        $med = $a[($#a / 2)];
    }
    
    for (my $i = 0; $i < $#a; $i++) {
        $a[$i]=0;
    }

    
    return $med;
}#median

#-----------------------------------------------------------------------------#

=head2 mean

 Title   : mean
 Usage   : mean();
 
 Function: Calcula la media de un array

 Returns : valor medio
 Args    : array

=cut

#-----------------------------------------------------------------------------#
sub mean {
    my $self = shift;
    (my @a) = @_;
    
    
    my $res=0;
    my $count=$#a+1;
    # print "calcula media $count";
    
    foreach my $e (@a) {
        $res+=$e;
    }
    
    $res=$res/$count;
    
    return $res;
}#mean


1;