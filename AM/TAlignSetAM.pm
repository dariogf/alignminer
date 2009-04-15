# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TAlignSetAM - Conjunto de alineamientos leidos de un fichero 

=head1 SYNOPSIS

    use AM::TAlignSetAM;

    # creando el objeto
    my $obj = AM::TAlignSetAM->new(fileName);
    

=head1 DESCRIPTION

La clase AM::TAlignSetAM Conjunto de alineamientos leidos de un fichero

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TAlignSetAM;

use strict;

use Log::Log4perl qw(get_logger);

use AM::TAlignAM;

use base qw(AM::TAMObject);




#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TAlignSetAM->new();
 
 Function: Constructor del objeto.

 Returns : TAlignSetAM Object
 Args    : $fileName : ParentClass

=cut

#-----------------------------------------------------------------------------#
sub new {
        my $class = shift;
        # print "init class : \n";
        my ($fileName) = @_;
        
        if (!(-e "$fileName")) {
            print "NO existe $fileName\n";
            die("File: $fileName, doesn't exists.");
            # FIXME - ¿porque el die no sale?
            exit; 
        }
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        
        
        $self->{_fileName}   = $fileName;
        $self->{_format} = undef;
        
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
   
   # $self->{_fileName} = shift if (@_);
   return $self->{_fileName};
}

#-----------------------------------------------------------------------------#

=head2 format

    Used to set or get the value of format

=cut

#-----------------------------------------------------------------------------#
sub format {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_format} = $param if defined($param);

   return $self->{_format};
}


#-----------------------------------------------------------------------------#

=head2 alignment

    Used to set or get the value of alignment

=cut

#-----------------------------------------------------------------------------#
sub alignmentSet {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_alignmentSet} = $param if defined($param);

   return $self->{_alignmentSet};
}


##############################################
##                 Functions                ##
##############################################

#-----------------------------------------------------------------------------#

=head2 _load

 Title   : _load
 Usage   : private only: $self->_load();
 
 Function: Carga el fichero de alineamientos en memoria

 Returns : Objeto Bio::AlignIO
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub _load {
    my $self = shift;
    
    my $alns;
    my $logger = get_logger();

    $logger->info("Loading:".$self->fileName);
    
    # Determina el tipo de fichero
    my $guesser = Bio::Tools::GuessSeqFormat->new( -file => $self->fileName);
    my $format  = $guesser->guess();

    # Si es un tipo conocido
    if ($format) {
        $logger->info("Detected file type: $format");
        # si no se pasa el parametro format, el lo busca, pero no tenemos el control
        $alns  = Bio::AlignIO->new(-file   => $self->fileName, 
                                -format => $format);
        $self->alignmentSet($alns);
        $self->format($format);
    }
    else 
    {
        
        # Si no es un tipo conocido
        $self->format('unknown');
        $logger->error("Unknown file type");
        $logger->info("The END.");
        exit;
    }
    

    
    # return $alns;

}

#-----------------------------------------------------------------------------#

=head2 next_aln

 Title   : next_aln
 Usage   : my $aln=$alignAM->next_aln();
 
 Function: Obtiene el siguiente alineamiento que se encuentra en el fichero de alineamientos.
 

 Returns : Objeto Bio::Align::AlignI
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub next_aln {
    my $self = shift;
    # (my $) = @_;
    
    my $alignAM;
    
    my $aln = $self->alignmentSet->next_aln();
    
    if (defined($aln)) {
        $alignAM = AM::TAlignAM->new($aln);
    }
    
    return $alignAM;
}#next_aln


1;  # so the require or use succeeds
