# Dario Guerrero
# =======================
# v0.1  -  2008

=head1 NAME

TAMObject - Clase base de todos los objetos de AlignMiner

=head1 SYNOPSIS

    use AM::TAMObject;

    # creando el objeto
    my $obj = AM::TAMObject->new();

=head1 DESCRIPTION

La clase AM::TAMObject representa una gráfica

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut


package AM::TAMObject;

use strict;


#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TAlignAM->new();
 
 Function: Constructor del objeto.

 Returns : $AlignAM Object
 Args    : $filename

=cut

#-----------------------------------------------------------------------------#

sub new {
        my $class = shift;
        
        # crea un hash vacio para alojar el objeto
        my $self  = {};
        
        # $self->{logger}   = get_logger();
        
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
##     Métodos de acceso a propiedades      ##
##############################################

##############################################
##     Métodos publicos      ##
##############################################





1;  # so the require or use succeeds

