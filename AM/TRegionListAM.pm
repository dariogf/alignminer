# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TRegionListAM - Mantiene una lista de regiones de una grafica que cumplen un requisito 

=head1 SYNOPSIS

    use AM::TRegionListAM;

    # creando el objeto
    my $obj = AM::TRegionListAM->new();
    

=head1 DESCRIPTION

La clase AM::TRegionListAM Mantiene una lista de regiones de una grafica que cumplen un requisito

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TRegionListAM;

use strict;

use Log::Log4perl qw(get_logger);

use base qw(AM::TAMObject);

# use AM::TAlignAM;

use Utils::Printing qw(:All);

use Utils::SaveFiles qw(:All);

use alignminer_h qw(:All);

#-----------------------------------------------------------------------------#

=head2 new

 Title   : newRegion
 Usage   : $var=TRegionListAM->new($description,$operation,$limit,$alignAM,$isSNP,@a);
           my $regionList = AM::TRegionListAM->new(sub {$_[0]<=$_[1]},$limit,@a);

 Function: Constructor del objeto.

 Returns : TRegionListAM Object
 Args    : $operation -> referencia a una función de comparación

=cut

#-----------------------------------------------------------------------------#
sub new {
        my $class = shift;
        # print "init class : \n";
        my ($description,$operation,$limit,$alignAM,$isSNP,$a,$mandatoryRegions) = @_;
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        
        my @regs=();
        $self->{_description}=$description;
        $self->{_operation}= $operation;
        $self->{_limit}=$limit;
        $self->{_alignAM} = $alignAM;
        $self->{_regionList} = \@regs;
        $self->{_lastMandatoryRegion} = 0;
        
        # cambia el tipo del hash por el de la clase
        bless ($self, $class);
        
        if ($isSNP) {
            $self->_filterSNP($a);
        }
        else{
            $self->_filterRegions($a,$mandatoryRegions);
        }
        
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

=head2 description

    Used to set or get the value of description

=cut

#-----------------------------------------------------------------------------#
sub description {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_description} = $param if defined($param);

   return $self->{_description};
}


#-----------------------------------------------------------------------------#

=head2 limit

    Used to set or get the value of limit

=cut

#-----------------------------------------------------------------------------#
sub limit {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_limit} = $param if defined($param);

   return $self->{_limit};
}


#-----------------------------------------------------------------------------#

=head2 operation

    Used to set or get the value of operation

=cut

#-----------------------------------------------------------------------------#
sub operation {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_operation} = $param if defined($param);

   return $self->{_operation};
}


#-----------------------------------------------------------------------------#

=head2 regionList

    Used to set or get the value of regionList

=cut

#-----------------------------------------------------------------------------#
sub regionList {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_regionList} = $param if defined($param);

   return @{$self->{_regionList}};
}


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

=head2 lastMandatoryRegion

    Used to set or get the value of lastMandatoryRegion

=cut

#-----------------------------------------------------------------------------#
sub lastMandatoryRegion {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_lastMandatoryRegion} = $param if defined($param);

   return $self->{_lastMandatoryRegion};
}

##############################################
##                 Functions                ##
##############################################

#-----------------------------------------------------------------------------#

=head2 _filterRegions

 Title   : _filterRegions
 Usage   : $regionList->_filterRegions();
 
 Function: Filtra las regiones con los datos indicados

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub _filterRegions {
    my $self = shift;
    # (my $) = @_;
    # my @a = @_;
    
    my @a = @{$_[0]};
    my $mandatoryRegions = $_[1];
    
    $self->lastMandatoryRegion(0);
    
    my $logger = get_logger();
    
    
    my @res;
    my $i=0;
    
    my $limit = $self->limit;
    
    my $addR = 1;
    my $phase = '';
    my $start;
    my $end;
    my $score;
    
    my $compareFunc = $self->operation;
    
    $logger->info("Filtering regions ".$self->description." limit: $limit ===  ".$self->description." ===");
    
    if (defined($mandatoryRegions)) {
      $logger->info("Restrict ".$self->description." using mandatoryRegions.");
    }
    
    foreach my $e (@a) {
        
        if ($phase eq '') {
            if (&$compareFunc($e,$limit)) {
                # comienza anotacion
                $start=$i;
                $score=$e;
                
                $phase='anotating';
            }
            
        }elsif ($phase eq 'anotating') {
            if (&$compareFunc($e,$limit)) {
                
                # sigue anotacion
                $score+=$e;
                # $phase='anotating';
            }else{
                $end=$i-1;
                
                $addR = 1;
                
                # comprobar si esta región tiene otra mandatory dentro
                if (defined($mandatoryRegions)) {
                  if ($mandatoryRegions->regionExists($start,$end,2)==0){
                    # descomentar abajo
                    $addR = 0;
                    # $logger->info("Skipping Region");
                    
                  }
                }
                
                if ($addR) {
                  # $logger->info("Adding Region");
                  # TODO - add =
                  if ($end>=$start){
	                  $self->addRegion($start,$end,$score/($end-$start+1));
		              }
                }
                
                # fin anotacion
                $phase='';
            }
            
        }
        
        $i++;
    }
    
    # sale del bucle ver si es el último elemento en anotating:
    if ($phase eq 'anotating') {
        # la última región es hasta el final

            $end=$i-1;
            
            $addR = 1;
            
            # comprobar si esta región tiene otra mandatory dentro
            if (defined($mandatoryRegions)) {
              if ($mandatoryRegions->regionExists($start,$end,2)==0){
                $addR = 0;
              }
            }
            
            # TODO - add =
            if ($addR) {
		          if ($end>=$start){
                $self->addRegion($start,$end,$score/($end-$start+1));
		          }
            }
            
            # fin anotacion
            $phase='';
    }
    
    my @rl = $self->regionList;
    saveToJSON("$JSON_OUTPUT_DIR".$self->description.".json",\@rl);
    # printArray('rl'.$self->description,@rl);
    $self->saveRegionToMAF();
}#_filterRegions

#-----------------------------------------------------------------------------#

=head2 _filterSNP

 Title   : _filterSNP
 Usage   : $self->_filterSNP();
 
 Function: Filtra los SNP

 Returns : Lista SNP
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub _filterSNP {
    my $self = shift;

    # my @a = @_;
    
    my @a = @{$_[0]};
    
    my $logger = get_logger();
    
    my @res;
    my $i=0;
    
    my $limit = $self->limit;
    
    my $phase = '';
    my $start;
    my $end;
    my $score;
    
    my $compareFunc = $self->operation;
    
    my $alignAM = $self->alignAM;
    my $countAM = $alignAM->countAM;
    
    my @consensus = $alignAM->consensus;
    
    $logger->info("Filtering SNP ".$self->description." limit: $limit ===  ".$self->description." ===");
    
    foreach my $e (@a) {
        
        if ($phase eq '') {
            if (&$compareFunc($e,$limit)) {
                # comienza anotacion
                $start=$i;
                $score=$e;
                
                $phase='anotating';
            }
            
        }elsif ($phase eq 'anotating') {
            # if ($e<=$limit) {
            if (&$compareFunc($e,$limit)) {
                
                # sigue anotacion
                $score+=$e;
                # $phase='anotating';
            }else{
                $end=$i-1;
                
                # Si el ancho es 1, es un SNP
                if ($start == $end ){
                    
                    # ASK-DONE -Cómo se sabe qué letra genera el pico de la gráfica
                    # ahora mismo miro que la base mayoritaria no aparezca en al menos 2 secuencias,
                    # y además este SNP aparece 2 o más veces en COUNT
                    # $logger->info("SNP: start:$start, end:$end, consensus: ".$consensus[$start].", count:".$countAM->value($consensus[$start],$start));
                    
                    # recordar que deben ser más de 4 secuencias para dar resultados coherentes
                    # si la freq del consenso es menor que el numero de seq -2, quiere decir que el cambio para el SNP aparece en al menos 2 secuencias.
                    
                    if (($countAM->value($consensus[$start],$start)) <= ($alignAM->numOfSequences()-2)) {
                        # $logger->info("SNP: start:$start, end:$end, consensus: ".$consensus[$start].", count:".$countAM->value($consensus[$start],$start));
                        
                        $self->addRegion($start,$end,$score/($end-$start+1));
                    }
                }
                # fin anotacion
                $phase='';
            }
            
        }
        
        $i++;
    }
    
    my @rl = $self->regionList;
    saveToJSON("$JSON_OUTPUT_DIR".$self->description.".json",\@rl);
    # printArray('rl'.$self->description,@rl);
    
    $self->saveRegionToMAF();
}#_filterSNP

#-----------------------------------------------------------------------------#

=head2 addRegion

 Title   : addRegion
 Usage   : $regionList->addRegion($start,$end,$score);
 
 Function: Añade una región a la lista

 Returns : 
 Args    : $start, $end, $score

=cut

#-----------------------------------------------------------------------------#
sub addRegion {
    my $self = shift;
    my ($start,$end,$score) = @_;
    my %elem;
    
    my $logger=get_logger();
    
    my @a=$self->regionList;
    
    # $elem{'startPos'}=$start;
    # $elem{'endPos'}=$end;
    
    $elem{'startPos'}=$start+$self->alignAM->left_slice();
    $elem{'left_slice'}=$self->alignAM->left_slice();
    # +$self->alignAM->left_slice();
    $elem{'endPos'}=$end+$self->alignAM->left_slice();
    # +$self->alignAM->left_slice();
    
    $elem{'score'}=sprintf("%.3f", $score);
    $elem{'score'}+=0; # convertir a numero para guardado en json correcto
    # round($score,2);
    
    # $logger->info("Added [$start,$end](".($end-$start+1).")=$score");
    
    push(@a,\%elem);
    
    $self->regionList(\@a);
    
}#addRegion

#-----------------------------------------------------------------------------#

=head2 regionExists

 Title   : regionExists
 Usage   : $self->regionExists($start, $end, $count);
 
 Function: Determina si existe alguna región en el rango determinado

 Returns : 1/0
 Args    : $start, $end, $count

=cut

#-----------------------------------------------------------------------------#
sub regionExists {

  my $self = shift;
  
  my ($start, $end, $count) = @_;
  
  my @regions=$self->regionList;
  
  my $middle;
  my $width;
  my $startElem = 0;
  my $endElem = 0;
  my %elem;
  
  my $res = 0;
  my $found = 0;
  
  my $logger=get_logger();
  
  # IMPROVEMENT -Optimizar empezando en la última región que se visitó.
  $logger->info("¿regionExists in [$start,$end]?");
  
  # foreach my $e (@regions) {
    
  # for (my $i = $self->lastMandatoryRegion(); $i <= $#regions; $i++) {
  for (my $i = 0; $i <= $#regions; $i++) {

    %elem = %{$regions[$i]};
    
    $self->lastMandatoryRegion($i);
    
    $startElem = $elem{'startPos'}-$elem{'left_slice'};
    $endElem = $elem{'endPos'}-$elem{'left_slice'};
    
    $width = $endElem-$startElem;
    $middle = $startElem + ($width/2);
    
    # $logger->info("  --- ck[$startElem,$endElem] in [$start,$end]");
    # la region está dentro del intervalo
    
    # if (($startElem>= $start) and ($startElem<=$end)) {
    if (($middle>= $start) and ($middle<=$end)) {
      # $logger->info(" -> Found M: $middle de [$startElem,$endElem] en [$start,$end]");
      
      # existe una región que empieza dentro de la actual.
      $found++;
      
      # Si es una region muy amplia >2 (no snp), tomar como buena inmediatamente
      if (($width)>1) {
        $res=1;
      }
      
      if (($res) or ($found >= $count)) {
        last;
      }
    }
    
    # finaliza busqueda si se pasa por la derecha
    if ($middle>$end) {
      # if ($i>0) {
      #   $self->lastMandatoryRegion($i-1);
      # }
      
      last;
    }
    
    
  }
  
  if (($res) or ($found >= $count)) {
    $res = 1;
  }
  
  # $logger->info("¿regionExists in [$start,$end] = $res?");
  
  
  return $res;
  
}#regionExists


# sub regionExists2 {
# 
#   my $self = shift;
#   
#   my ($start, $end, $count) = @_;
#   
#   my @regions=$self->regionList;
#   
#   my $middle;
#   my $startElem = 0;
#   my $endElem = 0;
#   my %elem;
#   
#   my $res = 0;
#   my $found = 0;
#   
#   my $logger=get_logger();
#   
#   # IMPROVEMENT -Optimizar empezando en la última región que se visitó.
#   
#   # foreach my $e (@regions) {
#     
#   for (my $i = $self->lastMandatoryRegion(); $i <= $#regions; $i++) {
# 
#     %elem = %{$regions[$i]};
#     
#     $self->lastMandatoryRegion($i);
#     
#     $startElem = $elem{'startPos'};
#     $endElem = $elem{'endPos'};
#     
#     # la region está dentro del intervalo
#     if (($startElem>= $start) and ($startElem<=$end)) {
#       
#       # existe una región que empieza dentro de la actual.
#       $found++;
#       
#       # Si es una region muy amplia >2 (no snp), tomar como buena inmediatamente
#       if (($endElem-$startElem)>=1) {
#         $res=1;
#       }
#       
#       if (($res) or ($found == $count)) {
#         last;
#       }
#     }
#     
#     # finaliza busqueda si se pasa por la derecha
#     if ($startElem>$end) {
#       # if ($i>0) {
#       #   $self->lastMandatoryRegion($i-1);
#       # }
#       
#       last;
#     }
#     
#     
#   }
#   
#   if (($res) or ($found == $count)) {
#     $res = 1;
#   }
#   
#   $logger->info("¿regionExists in [$start,$end] = $res?");
#   
#   
#   return $res;
#   
# }#regionExists

#-----------------------------------------------------------------------------#

=head2 saveRegionToMAF

 Title   : saveRegionToMAF
 Usage   : saveRegionToMAF($filename,$name,@a);
 
 Function: Guarda en un fichero las regiones con formato MAF

 Returns : 
 Args    : 
 
 ##maf version=1
 # parametros del programa

 a score=puntuaciónRegión1 tipo=CON
 s secuencia1 inicio1 tamaño1 + LongAlineamiento AAA-GGGAATGTTAACCAAATGA
 s secuencia2 inicio1 tamaño1 + LongAlineamiento AAA-GGGAATGTTAACCAAATGA
 s secuencia3 inicio1 tamaño1 + LongAlineamiento AAA-GGGAATGTTAACCAAATGA

 a score=puntuaciónRegión2 tipo=DIV
 s secuencia1 inicio2 tamaño2 + LongAlineamiento GGGAATGTTA
 s secuencia2 inicio2 tamaño2 + LongAlineamiento GGTGACGTTA
 s secuencia3 inicio2 tamaño2 + LongAlineamiento GGAGCGGTTA

 a score=puntuaciónRegión3 tipo=SNP
 s secuencia1 inicio3 1 + LongAlineamiento A
 s secuencia2 inicio3 1 + LongAlineamiento G
 s secuencia3 inicio3 1 + LongAlineamiento A

=cut

#-----------------------------------------------------------------------------#
sub saveRegionToMAF {
    
    my $self = shift;
      
    #my ($filename) = @_;
    
    
    my $tipo = '';
    
    my $logger=get_logger();
 
 	  my $descr = $self->description;
    
    if ($descr =~ m/_above/) {
    	$tipo = 'CON';
    	$descr =~ s/_above/_CON/;
    }elsif ($descr =~ m/_below/) {
    	$tipo = 'DIV';
    	$descr =~ s/_below/_DIV/;
    }elsif ($descr =~ m/_snp/) {
    	$tipo = 'SNP';
    	$descr =~ s/_snp/_SNP/;
    }
    
    my $filename = $DATA_OUTPUT_DIR.$descr.'.maf';
    
		$logger->info("Saving MAF for ".$filename);
    
    my @rl = $self->regionList;
    
    open (FILE, ">$filename");
    
		print FILE "##maf version=1\n";
		
		print FILE "# alignminer\n";
    print FILE "# \"s line\" : s sequenceID start length strandedness alignmentLength sequence \n";
    
    my $i=0;
    my $tam = 0;
    my $start = 0;
    
    my $longAlign = $self->alignAM->alignment->length();
    
    my $j="";
    
    foreach my $e (@rl) {
    
    		print FILE "\n";
    		
        print FILE "a score=",$e->{'score'}," type=$tipo\n";
        
        $tam = $e->{'endPos'}-$e->{'startPos'}+1;
        $start = $e->{'startPos'}-$e->{'left_slice'};
         # - $self->alignAM->left_slice();
        my $start_display= $e->{'startPos'};
        
        for (my $seqindex = 1; $seqindex <= $self->alignAM->alignment->no_sequences(); $seqindex++) {
          my $seq = $self->alignAM->alignment->get_seq_by_pos($seqindex);
          
          my $seqStr = $seq->seq();
          
          # convierte a mayusculas
          $seqStr =~ tr/a-z/A-Z/;
          
          my $seqRegion = substr($seqStr,$start,$tam);
          
          
          
          print FILE "s ",$seq->display_id," $start_display $tam + $longAlign $seqRegion\n";
			}      
        
    }
    
    
    close(FILE);
    
}#saveRegionToMAF

#-----------------------------------------------------------------------------#

=head2 save_stats

 Title   : save_stats
 Usage   : save_stats();
 
 Function: Saves stats to a file

 Returns : returns
 Args    : arguments

=cut

#-----------------------------------------------------------------------------#
sub save_stats {

  my $self = shift;
    
  #my ($filename) = @_;
  
  my $tipo = '';
  
  my $logger=get_logger();

  my $descr = $self->description;
  
  if ($descr =~ m/_above/) {
  	$tipo = 'CON';
  	$descr =~ s/_above/_CON/;
  }elsif ($descr =~ m/_below/) {
  	$tipo = 'DIV';
  	$descr =~ s/_below/_DIV/;
  }elsif ($descr =~ m/_snp/) {
  	$tipo = 'SNP';
  	$descr =~ s/_snp/_SNP/;
  }
  
  # my $filename = $DATA_OUTPUT_DIR.$descr.'_STATS.txt';
  my $filename = $DATA_OUTPUT_DIR.'STATS.txt';
  
	$logger->info("Saving STATS for ".$filename);
  
  my @rl = $self->regionList;
  
  open (FILE, ">>$filename");
  
	print FILE "#    STATS for $descr\n";
	
	print FILE "#=============\n";
  print FILE "RANGE\tCOUNT\n";
  
  my $i=0;
  my $tam = 0;
  my $start = 0;
  
  my $ra=0;
  my $rb=0;
  my $rc=0;
  
  
  
  my $longAlign = $self->alignAM->alignment->length();
  
  my $j="";
  
  foreach my $e (@rl) {
      $tam = $e->{'endPos'}-$e->{'startPos'}+1;
      if ($tam>=0 and $tam<=5) {
        $ra++;
      }elsif ($tam>=6 and $tam<=10) {
        $rb++;
      }else{
        $rc++;
      }
      
  }
  
  print FILE "[0-5]\t$ra\n";
  print FILE "[6-10]\t$rb\n";
  print FILE "[11,inf]\t$rc\n";
  
  print FILE "\n\n";
  
  close(FILE);


}#save_stats


1;  # so the require or use succeeds
