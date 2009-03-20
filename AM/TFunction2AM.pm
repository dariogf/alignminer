# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TFunction2AM - Calcula la función f1 

=head1 SYNOPSIS

    use AM::TFunction2AM;

    # creando el objeto
    my $obj = AM::TFunction2AM->new($dataFileName);

=head1 DESCRIPTION

AM::TFunction2AM calcula la función f1

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TFunction2AM;

use strict;

# use AM::TAlignAM;

use Log::Log4perl qw(get_logger);

use base qw(AM::TBaseFunctionAM);

use AM::TGraphAM;

#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TFunction2AM->new();
 
 Function: Constructor del objeto.

 Returns : TFunction2AM Object
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
        # $self->{_alignment}   = $alignAM;
        
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
    
    my $countValue;
    my $matrixValue;
    my $value=0;
    
    # para cada base distinta en dicha posición
    foreach my $k ($self->alignAM->countAM->keyList()) {
        
        $matrixValue = $self->matrixAM->coefs($consensusValue,$k);
        $countValue = $self->alignAM->countAM->value($k,$i);
        
        
        # TODO-DONE -¿Qué se hace cuando un valor no está en la tabla?
        # TODO-DONE -Hacer independiente de mayusculas y minusculas
        
        # FIXME-DONE -contar los - y . (añadirlos la tabla).
        
        $value+=$countValue*$matrixValue;
    }
    
    $value=$value/$nseq;
    
    return $value;
}#evaluatePos


1;  # so the require or use succeeds
