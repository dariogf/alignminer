# Dario Guerrero
# =======================
# v0.1  -  2008

=head1 NAME

TCountAM - Mantiene una tabla de frecuencias de elementos de cada base de la secuencia 

=head1 SYNOPSIS

    use AM::TCountAM;

    # creando el objeto
    my $obj = AM::TCountAM->new(alignAM);
    

=head1 DESCRIPTION

La clase AM::TCountAM Mantiene una tabla de frecuencias de elementos de cada base de la secuencia

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TCountAM;

use base qw(AM::TAMObject);

use strict;

use Log::Log4perl qw(get_logger);

use alignminer_h qw(:All);


use Utils::Printing qw(:All);



use Utils::SaveFiles qw(:All);


#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TCountAM->new();
 
 Function: Constructor del objeto.

 Returns : TCountAM Object
 Args    : alignAM : TAMObject

=cut

#-----------------------------------------------------------------------------#
sub new {
        my $class = shift;
        # print "init class : \n";
        my ($alignAM) = @_;
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        
        $self->{_alignAM}   = $alignAM;
        
        # cambia el tipo del hash por el de la clase
        bless ($self, $class);
        
        $self->_populateData();
        
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

=head2 alignAM

    Used to set or get the value of alignAM

=cut

#-----------------------------------------------------------------------------#
sub alignAM {
   my $self = shift;
   
   my ( $param ) = @_;
   $self->{_alignAM} = $param if defined($param);

   return $self->{_alignAM};
}

#-----------------------------------------------------------------------------#

=head2 count

    Used to set or get the value of count

=cut

#-----------------------------------------------------------------------------#
sub count {
   my $self = shift;
   
   my ( $param ) = @_;
   
   # if (defined($param)) {
   #     # print("establece count:$param");
   #     # printHashOfArray('co',%$param);
   # }
   
   $self->{_count} = $param if defined($param);   

   return %{$self->{_count}};
}

#-----------------------------------------------------------------------------#

=head2 value

    Used to set or get the value of value

=cut

#-----------------------------------------------------------------------------#
sub value {
   my $self = shift;
   
   my ( $k, $i ) = @_;
   
   # convierte $k a mayusc, por si acaso
   $k =~ tr/a-z/A-Z/;

   my $v=0;
 
   my %co = $self->count();
   
   # para cuando sea una matriz dispersa
   if (defined($co{$k}[$i])) {
      $v=$co{$k}[$i];
   }
   
   
   # my $v2 = $self->count()->{'B'};
   # print "v2:$v2";
   # print("co2a:%co\n");
   # 
   # printHashOfArray('co2b:',%co);
   # print "value:". $co{$k}[$i];
   
   # # my @va = $co{'a'};
   # my @va=();
   # # $count{$k}[$i]
   # 
   # print("val:@va; \n");
   
   return $v;
}

#-----------------------------------------------------------------------------#

=head2 seq

    Used to set or get the value of seq

=cut

#-----------------------------------------------------------------------------#
sub seq {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_seq} = $param if defined($param);

   return $self->{_seq};
}


##############################################
##                 Functions                ##
##############################################

#-----------------------------------------------------------------------------#

=head2 keyList

 Title   : keyList
 Usage   : my @keys=keyList();
 
 Function: Obtiene la lista de claves del hash count

 Returns : array con lista de claves
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub keyList {
    my $self = shift;
    # (my $) = @_;

    my %co = $self->count();
    
    return (keys %co);
    
}#keyList


#-----------------------------------------------------------------------------#

=head2 _populateData

 Title   : _populateData
 Usage   : private only: $self->_populateData();
 
 Function: Populates the count table:
            ACGTACGTACGT
            ACGTAGTCACGT
            AGTCAGCTACAG
         ===============
         A=>300030003010
         C=>020101110300 
         G=>012002100021
         T=>001200120002

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub _populateData {
    my $self = shift;
    # (my $) = @_;

    (my $alignAM) = @_;
    
    my $logger=get_logger();

    my %count;
    
    startAddToArrayJSON("$JSON_OUTPUT_DIR"."alignment.json");
    
    $logger->info("Processing sequences");
    
    
      # recorrer todas las secuencias (filas)
      for (my $seqindex = 1; $seqindex <= $self->alignAM->alignment->no_sequences(); $seqindex++) {
          my $seq = $self->alignAM->alignment->get_seq_by_pos($seqindex);
          
          my $seqStr = $seq->seq();
          
          # convierte a mayusculas
          $seqStr =~ tr/a-z/A-Z/;
          
          # trocea la secuencia en un array de caracteres
          my @seqString = split(//,$seqStr);
          
          # guarda el alignment en json
         if ($seqindex<$self->alignAM->alignment->no_sequences()) {
             # pasar un 0 para añadir ,
        addToArrayJSON("$JSON_OUTPUT_DIR"."alignment.json",$seq->display_id.'","'.$seqStr,0);
         }else{
            # pasar 1 para no añadir ,
        addToArrayJSON("$JSON_OUTPUT_DIR"."alignment.json",$seq->display_id.'","'.$seqStr,1); 
         }
          
          
          # obtiene el tamaño
          my $seqSize=$#seqString+1;
          
          # $logger->info("Processing Seq with ID:".$seq->display_id()." [size=$seqSize]\n");

          # recorrer la secuencia en toda su longitud (columnas)
          for (my $i = 0; $i < $seqSize; $i++) {
               # IMPROVEMENT -Se puede optimizar aqui rellenando %count antes
               
               # IMPROVEMENT -Ver como obtener el alfabeto completo de dna o proteina en un array para optimizar calculo %count
               my $base = $seqString[$i];
                              
              # si count no esta definido para una letra concreta
              if (!defined($count{$base})) {
                # IMPROVEMENT -Aqui se puede poner como matriz dispersa, ahorra RAM                
                # rellenarlo
                for (my $j = 0; $j < $seqSize; $j++) {
                    $count{$base}[$j]=0;
                }
              }
              # incrementar la aparicion de una letra en una columna
              $count{$base}[$i]+=1;
          }
      }
      
      endAddToArrayJSON("$JSON_OUTPUT_DIR"."alignment.json");
          
          
      # guarda el hash
      $self->count(\%count);
      
      # printHashOfArray('Count',$self->count());
      # my $v=$self->value('a',4);
      # print "value:$v";
      
}#calculate

#-----------------------------------------------------------------------------#

=head2 getConsensus

 Title   : getConsensus
 Usage   : my $value=getConsensus($i);
 
 Function: Obtiene la base que más se repite en la columna $i

 Returns : returns
 Args    : arguments

=cut

#-----------------------------------------------------------------------------#
sub getConsensus {
    my $self = shift;
    (my $i) = @_; #columna en la que buscar el maximo 

    my $v; #valor temporal
    my $mk=''; #key con valor maximo de la columna
    my $m=0; #maximo temporal en una columna
    
    # comprobar todas las claves
    foreach my $k ($self->keyList()) {
        $v=$self->value($k,$i);
        # if (!($k eq '-') and ($v>=$m)) {
        if ($v>=$m) {
            $m=$v;
            $mk=$k;
        }
    }
    
    return $mk;
    
}#getConsensus


1;  # so the require or use succeeds
