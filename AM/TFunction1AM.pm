# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TFunction1AM - Calcula la función f1 

=head1 SYNOPSIS

    use AM::TFunction1AM;

    # creando el objeto
    my $obj = AM::TFunction1AM->new($dataFileName);

=head1 DESCRIPTION

AM::TFunction1AM calcula la función f1

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TFunction1AM;

use strict;

# use AM::TAlignAM;

use Log::Log4perl qw(get_logger);

use base qw(AM::TBaseFunctionAM);

#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TFunction1AM->new();
 
 Function: Constructor del objeto.

 Returns : TFunction1AM Object
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

    my $countValue = $self->alignAM->countAM->value($consensusValue,$i);
    # my $matrixValue = $self->matrixAM->coefs(col,fil);
    
    # print "consenVal:$consensusValue,countVal:$countValue,nseq:$nseq\n";
    
    my $value = ((2*$countValue)-$nseq)/$nseq;
    
    return $value;
}#evaluatePos


1;  # so the require or use succeeds
