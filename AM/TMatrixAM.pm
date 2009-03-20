# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TMatrixAM - Encapsula la matriz de coeficientes para calculo de funciones 

=head1 SYNOPSIS

    use AM::TMatrixAM;

    # creando el objeto
    my $obj = AM::TMatrixAM->new($fileName);
    

=head1 DESCRIPTION

La clase AM::TMatrixAM Encapsula la matriz de coeficientes para calculo de funciones

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TMatrixAM;

use strict;

use Log::Log4perl qw(get_logger);

use Utils::Printing qw(:All);

use base qw(AM::TAMObject);

# use constant MATRIX_FOLDER  => './matrix/';
use alignminer_h qw(:All);

#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TMatrixAM->new();
 
 Function: Constructor del objeto.

 Returns : TMatrixAM Object
 Args    : $fileName : TAMObject

=cut

#-----------------------------------------------------------------------------#
sub new {
        my $class = shift;
        # print "init class : \n";
        my ($fileName) = @_;
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        
        $self->{_fileName}   = $fileName;
        
        # cambia el tipo del hash por el de la clase
        bless ($self, $class);
        
        $self->_load();
        
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

#-----------------------------------------------------------------------------#

=head2 fileName

    Used to set or get the value of fileName

=cut

#-----------------------------------------------------------------------------#
sub fileName {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_fileName} = $param if defined($param);

   return $self->{_fileName};
}

#-----------------------------------------------------------------------------#

=head2 matrix

    Used to set or get the value of matrix

=cut

#-----------------------------------------------------------------------------#
sub matrix {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_matrix} = $param if defined($param);

   return %{$self->{_matrix}};
}

#-----------------------------------------------------------------------------#

=head2 coefs

    Used to set or get the value of coefs

=cut

#-----------------------------------------------------------------------------#
sub coefs {
   my $self = shift;
   
   my ( $colk, $filk ) = @_;
   my $res = 0;
   #convierte a mayusculas las claves
   
   $colk =~ tr/a-z/A-Z/;
   $filk =~ tr/a-z/A-Z/;
   
   my %mat = $self->matrix;
   if (exists($mat{$colk}{$filk})) {
       $res = $mat{$colk}{$filk};
   }else{
       print "No existe coef: $colk,$filk\n";
   }
   
   return $res;
}


##############################################
##                 Functions                ##
##############################################

#-----------------------------------------------------------------------------#

=head2 _load

 Title   : _load
 Usage   : Private only: $self->_load();
 
 Function: Carga la matriz de un fichero

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub _load {
    my $self = shift;
    # (my $) = @_;
    
    # Abre el fichero
    open(MAT,$MATRIX_FOLDER.$self->fileName);

    my $line; #linea del fichero de texto
    my $l1; #indica si se ha leido la linea con las cabeceras ya
    my @keys; #cabeceras
    my %hoh;
    
    # lee todas las lineas
    while ($line=<MAT>) {

        # ignora las lineas que empiezan por #
        if (!($line =~ /^#/)) {
            
            # Si es la primera linea, tenemos la lista de letras ordenadas.
            if (!defined($l1)) {
                
                # define la linea para que no entre mas aqui
                $l1=$line; 
                
                # parte la linea en caracteres por los espacios
                my @keys1=split(/\s+/,$l1);
                
                # recorre las columnas y borra las no validas
                for (my $i = 0; $i <= $#keys1; $i++) {
                    if (!$keys1[$i] eq '') {
                        push(@keys,$keys1[$i]);
                        # $hoh{$keys1[$i]}={A=>0};
                        # delete no anda
                        # delete $keys[$i];
                    }
                }
                
                # print(join(':',@keys)."\n");
                #                                 
                next; #sigue en la sig linea
            }

            # trocea la primera linea en los espacios
            my @vals=split(/\s+/,$line);

            # añade la linea por columnas a la hash
            my $i=1;
            foreach my $col (@keys) {
                $hoh{$vals[0]}{$col}=$vals[$i];
                $i++;
            }
        }
    }
    
    # cierra el fichero
    close(MAT);
    
    # printHashOfHash('hoh',%hoh);
    
    $self->matrix(\%hoh);
    
    # printHashOfHash('matrix',$self->matrix);
    
}#_load

1;  # so the require or use succeeds
