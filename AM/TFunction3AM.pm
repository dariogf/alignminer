# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TFunction3AM - Calcula la función f1 

=head1 SYNOPSIS

    use AM::TFunction3AM;

    # creando el objeto
    my $obj = AM::TFunction3AM->new($dataFileName);

=head1 DESCRIPTION

AM::TFunction3AM calcula la función f1

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TFunction3AM;

use strict;

# use AM::TAlignAM;

use Log::Log4perl qw(get_logger);

use Utils::Stats qw(:All);

use base qw(AM::TBaseFunctionAM);

#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TFunction3AM->new();
 
 Function: Constructor del objeto.

 Returns : TFunction3AM Object
 Args    : alignment

=cut

#-----------------------------------------------------------------------------#
sub new {
        my $class = shift;
        # print "init class : \n";
        my ($alignAM,$name) = @_;
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        $self->{_xlabel}   = 'Position';
        $self->{_ylabel}   = 'Entropy';
        
        
        # print("alnsize:".$self->{_alignAM}->alignment->length);
        
        # cambia el tipo del hash por el de la clase
        bless ($self, $class);
        
        return $self;
}

#-----------------------------------------------------------------------------#

=head2 DESTROY

 Title   : DESTROY
 Usage   : Llamado automáticamente.
 
 Function: Destructor del objeto.

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub DESTROY {
    my $self = shift;
}

##############################################
##        Property Access Methods           ##
##############################################



##############################################
##                 Functions                ##
##############################################

#-----------------------------------------------------------------------------#

=head2 evaluatePos

 Title   : evaluatePos
 Usage   : my $variable = evaluatePos();
 
 Function: Evalua el valor de la función en un punto

 Returns : escalar: el valor de la evaluación 
 Args    : posición

=cut

#-----------------------------------------------------------------------------#
sub evaluatePos {
    my $self = shift;
    
    my ($i,$nseq,$consensusValue) = @_;
    
    # print "consenVal:$consensusValue,countVal:$countValue,nseq:$nseq\n";
    my $countValue;
    my $matrixValue;
    my $value=0;
    
    # para cada base distinta en dicha posición
    foreach my $k ($self->alignAM->countAM->keyList()) {
        
        # IMPROVEMENT -Leyendo toda la columna de consensusValue de una vez
        $matrixValue = $self->matrixAM->coefs($consensusValue,$k);
        
        # IMPROVEMENT -Leyendo toda la columna de $i de una vez
        $countValue = $self->alignAM->countAM->value($k,$i);
        
        my $co=0;
        
        $co=$countValue/$nseq;
        
        # ASK-DONE -La Entropía "http://es.wikipedia.org/wiki/Entropía_(información)", no puede ser entre 0 y 1 por causa de $matrixValue.
        
        if ($co!=0) {
            $value+=((-1*$co*log_2($co)));
            # $value+=((-1*$co*log_2($co)));
            # $value+=((-1*$co*log_2($co))*$matrixValue);
        }
    }
    
    return -1*$value;
}#evaluatePos


1;  # so the require or use succeeds
