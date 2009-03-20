# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TFunction4AM - Calcula la función f1 

=head1 SYNOPSIS

    use AM::TFunction4AM;

    # creando el objeto
    my $obj = AM::TFunction4AM->new($dataFileName);

=head1 DESCRIPTION

AM::TFunction4AM calcula la función f1

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TFunction4AM;

use strict;

# use AM::TAlignAM;

use Log::Log4perl qw(get_logger);

use Utils::Stats qw(:All);

use base qw(AM::TBaseFunctionAM);

#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TFunction4AM->new();
 
 Function: Constructor del objeto.

 Returns : TFunction4AM Object
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
        $self->{_ylabel}   = 'Variability';
        
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
    
    my $differentBases =0;
    
    # # para cada base distinta en dicha posición
    foreach my $k ($self->alignAM->countAM->keyList()) {
      
      if (($self->alignAM->countAM->value($k,$i))>0) {
        $differentBases++;
      }
    }
    
    $countValue = $self->alignAM->countAM->value($consensusValue,$i);

    my $co=0;

    $co=$countValue/$nseq;

    if ($co!=0) {
      $value = ($differentBases)/$co;
    }
    
    return -1*$value;
}#evaluatePos


1;  # so the require or use succeeds
