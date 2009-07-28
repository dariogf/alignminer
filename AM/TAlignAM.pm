# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TAlignAM - Clase que encapsula un alineamiento 

=head1 SYNOPSIS

    use AM::TAlignAM;

    # creando el objeto
    my $obj = AM::TAlignAM->new($params);
    

=head1 DESCRIPTION

AM::ALignAM 

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TAlignAM;

use strict;

use alignminer_h qw(:All);

use Bio::AlignIO;

use Log::Log4perl qw(get_logger);

use AM::TFunction1AM;
use AM::TFunction2AM;
use AM::TFunction3AM;
use AM::TFunction4AM;

use AM::TMatrixAM;

use Utils::Printing qw(:All);

use Utils::SaveFiles qw(:All);

use base qw(AM::TAMObject);

use JSON;

# my $logger;

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
        # print "init class : $class\n";
        my ($alignment) = @_;
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        
        my $logger = get_logger();

        
        
        $self->{_alignment} = $alignment;
        $self->{_original_length} = $self->alignment->length;
	 
        $self->{_left_slice} = '0';

        $logger->info("Alignment original length: ".$self->alignment->length);

        # get alphabet and slice alignment
        $self->{_alphabet} = $self->extractAlphabet_and_slice();

        $logger->info("Alignment usefull length: ".$self->alignment->length);
        
        $self->{_qInfo} = undef;
        
        # print("file:$fname,".$self->fileName());
        
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

sub original_length {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_original_length} = $param if defined($param);

   return $self->{_original_length};
}

sub left_slice {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_left_slice} = $param if defined($param);

   return $self->{_left_slice};
}

#-----------------------------------------------------------------------------#

=head2 alignment

    Used to set or get the value of alignment

=cut

#-----------------------------------------------------------------------------#
sub alignment {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_alignment} = $param if defined($param);

   return $self->{_alignment};
}

#-----------------------------------------------------------------------------#

=head2 countAM

    Used to set or get the value of countAM

=cut

#-----------------------------------------------------------------------------#
sub countAM {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_countAM} = $param if defined($param);

   return $self->{_countAM};
}

#-----------------------------------------------------------------------------#

=head2 consensus

    Used to set or get the value of consensus

=cut

#-----------------------------------------------------------------------------#
sub consensus {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_consensus} = $param if defined($param);

   return @{$self->{_consensus}};
}

#-----------------------------------------------------------------------------#

=head2 getConsensus

    Used to set or get the value of consensus in a index basis

=cut

#-----------------------------------------------------------------------------#
sub getConsensus {
   my $self = shift;
   
   my ( $i ) = @_;
   
   my @c =$self->consensus;
   
   return $c[$i];

}

#-----------------------------------------------------------------------------#

=head2 qInfo

    Used to set or get the value of qInfo

=cut

#-----------------------------------------------------------------------------#
sub qInfo {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_qInfo} = $param if defined($param);

   return $self->{_qInfo};
}


##############################################
##                 Functions                ##
##############################################

#-----------------------------------------------------------------------------#

=head2 numOfSequences

 Title   : numOfSequences
 Usage   : $self->numOfSequences();
 
 Function: Devuelve el número de secuencias del alineamiento

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub numOfSequences {
    my $self = shift;
    
    return $self->alignment->no_sequences();
    
}#numOfSequences


#-----------------------------------------------------------------------------#

=head2 alphabet

    Used to get the value of alphabet

=cut

#-----------------------------------------------------------------------------#
sub alphabet {
   my $self = shift;
   
   # my ( $param ) = @_;
   #       
   #    $self->{_alphabet} = $param if defined($param);
   
   return $self->{_alphabet};
   
   # if ($self->alignment->no_sequences>0) {
   #      return $self->alignment->get_seq_by_pos(1)->alphabet;
   # }else
   # {
   #      return "none";
   # }
   
}

#-----------------------------------------------------------------------------#

=head2 calculateConsensus

 Title   : calculateConsensus
 Usage   : my @consensus = calculateConsensus($withBioperl,$alignAM,%count);
 
 Function: Calcula el consenso del alineamiento. Existen dos posibilidades de calcularlo

 Returns : returns
 Args    : $withBioperl = 0 -> usa cálculo manual.
           $withBioperl = 1 -> usa cálculo de bioperl. 
           $alignAM = el alineamiento leído por bioperl.
           %count = el hash con las frecuencias de aparición de cada base.
=cut

#-----------------------------------------------------------------------------#
sub calculateConsensus {
    my $self = shift;
    
    my ($withBioperl) = @_;
    
    my $logger = get_logger();
    
    my $masterFound = 0;
    
    my @max; # resultado del cálculo del consenso.
    
    # si hay definida una secuencia master, usamos esa
    if (!($self->qInfo()->{'master'} eq 'NONE')) {
      
      $logger->info("Using Master Sequence: ".$self->qInfo()->{'master'});
      
      for (my $seqindex = 1; $seqindex <= $self->alignment->no_sequences(); $seqindex++) {
        my $seq = $self->alignment->get_seq_by_pos($seqindex);
        
        # si el nombre de secuencia es el que buscamos.
        if ($seq->display_id eq $self->qInfo()->{'master'}) {

          my $seqStr = $seq->seq();
          
          # convierte a mayusculas
          $seqStr =~ tr/a-z/A-Z/;
          
          # trocea la secuencia en un array de caracteres
          @max = split(//,$seqStr);
          
          $logger->info("Master sequence found: ".$self->qInfo()->{'master'});
          
          $masterFound = 1;
        }
      }
    }
    
    if (!$masterFound) { # si no hay secuencia master
        if ($withBioperl) { # si el modo es 1, usar bioperl
            $logger->info("Calculating consensus with bioperl");
            my $consensus = $self->alignment->consensus_string();
        
            # bioperl devuelve ? en vez de -
            $consensus =~ tr/[\?]/-/;
        
            $consensus =~ tr/a-z/A-Z/;
        
            # trocea el string en un array
            @max=split(//,$consensus);
        
            # printArray("max",@max);
        
        }else
        {
            $logger->info("Calculating consensus manually");
        
            # recorrer en longitud la secuencia
            for (my $i = 0; $i < $self->alignment->length(); $i++) {
            
                $max[$i]=$self->countAM->getConsensus($i);

                if ($i % 4000 == 0) {
                    $logger->info("Calculating consensus [$i], wait...");
                }
            
            }
        }
    
    }
    
    # return @max;
    # almacena el resultado en la propiedad consensus
    $self->consensus(\@max);
    
}#calculateConsensus

#-----------------------------------------------------------------------------#

=head2 getQuickInfo

 Title   : getQuickInfo
 Usage   : $self->getQuickInfo();
 
 Function: Obtiene la información rapida del alineamiento

 Returns : returns
 Args    : arguments

=cut

#-----------------------------------------------------------------------------#
sub getQuickInfo {
  my $self = shift;
  
  (my $format) = @_;
  
  my $qInfoFile = "$JSON_OUTPUT_DIR"."alignInfo.json";

  my %qinfo;
  
  my $logger = get_logger();
  
  # existe el fichero, lo carga.
  if (-e $qInfoFile) {
    $logger->info("QuickInfo file exists, loading.");
    
    # lee fichero con  qinfo del align
    open my $qinfo_fh, "$qInfoFile"
      or die "Cannot open $qInfoFile";
    my $qit = <$qinfo_fh>;
    my $qinfoJSON = from_json($qit);
    close $qinfo_fh;
    
    %qinfo=%{$qinfoJSON};
    
  }else{
    
  # no existe fichero, crea estructura
  
      $logger->info("QuickInfo file doesn't exists, creating.");

      $qinfo{'validAlignment'}='1';
  
      $qinfo{fileType}=$format;
  
      if ($format eq 'unknown') {
          $qinfo{'validAlignment'}='0';
      }
  
      $qinfo{flush}='1';
  
      # comprobar si tienen el mismo tamaño
      if (!$self->alignment->is_flush()) {
            $qinfo{'flush'}='0';
            $qinfo{'validAlignment'}='0';
      }
    
      $qinfo{length}=$self->alignment->length;
      $qinfo{original_length}=$self->original_length;
      $qinfo{left_slice}=$self->left_slice;
      
      
      $qinfo{numberOfSequences}=$self->alignment->no_sequences;
  
      # comprobar numero secuencias en el align
      if ($self->alignment->no_sequences() < 2 ) {
          $qinfo{'validAlignment'}='0';
      }
  
      # determinar el alfabeto de la primera secuencia
      $qinfo{alphabet}=$self->alphabet;
    
  
      my @seqs=$self->getSequenceNames();

      $qinfo{sequences}=\@seqs;
      

  }
  
      $self->qInfo(\%qinfo);
  
}#getQuickInfo


#-----------------------------------------------------------------------------#

=head2 getQuickInfo

 Title   : saveQuickInfo
 Usage   : $alignam->saveQuickInfo($format);
 
 Function: Obtiene información sobre el alineamiento

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub saveQuickInfo {
    my $self = shift;
    
    saveToJSON("$JSON_OUTPUT_DIR"."alignInfo.json",$self->qInfo());
    
}#saveQuickInfo


#-----------------------------------------------------------------------------#

=head2 getSequenceNames

 Title   : getSequenceNames
 Usage   : @a=$self->getSequenceNames();
 
 Function: Devuelve array con todos los nombres de secuencias

 Returns : array con secuencias
 Args    : ninguno

=cut

#-----------------------------------------------------------------------------#
sub getSequenceNames {
    my $self = shift;
    
    my @res;
    
    push(@res,"NONE");
    
    for (my $seqindex = 1; $seqindex <= $self->alignment->no_sequences(); $seqindex++) {
      my $seq = $self->alignment->get_seq_by_pos($seqindex);
      
      my $nombreSeq=$seq->display_id;
      
      push(@res,$nombreSeq);
    }
  
    return @res;
}#getSequenceNames

#-----------------------------------------------------------------------------#

=head2 incStages

 Title   : incStages
 Usage   : $self->incStages($incBy,$description);
 
 Function: description

 Returns : returns
 Args    : arguments

=cut

#-----------------------------------------------------------------------------#
sub incStages {
  my $self = shift;
  
  my ($incBy,$description) = @_;

  $self->qInfo()->{'stagesDone'} += $incBy;
  $self->qInfo()->{'stageDescription'}=$description;
  $self->saveQuickInfo();
  
}#incStages

#-----------------------------------------------------------------------------#

=head2 setT1

 Title   : setT1
 Usage   : $self->setT1($tag);
 
 Function: Anota el tiempo en la estructura de qinfo

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub setT1 {
  my $self = shift;
  
  my ($tag) = @_;

  $self->qInfo()->{$tag} = time;
  
  $self->saveQuickInfo();
  
}#annotateTime

#-----------------------------------------------------------------------------#

=head2 setT2

 Title   : setT2
 Usage   : $self->setT2($tag);
 
 Function: anota t2 de tiempo

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub setT2 {
  my $self = shift;
  
  my ($tag) = @_;
  
  my $logger = get_logger();
  
  $self->qInfo()->{$tag} = time-($self->qInfo()->{$tag});
  
  $logger->info("Time $tag = ".$self->qInfo()->{$tag}." seconds (".(($self->qInfo()->{$tag})/60)." min)");
  
  $self->saveQuickInfo();
  
}#setT2


#-----------------------------------------------------------------------------#

=head2 process

 Title   : process
 Usage   : $alignAM->process();
 
 Function: Procesa el alineamiento

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub process {
    my $self = shift;
    # (my $) = @_;
    
    my $logger = get_logger();
    
    my $matrix;
    
    # numero maximo etapas
    $self->qInfo()->{'stagesCount'}=8;
    
    # anota etapa actual
    $self->qInfo()->{'stagesDone'} =0;
    $self->qInfo()->{'stageDescription'}='';
    
    $self->incStages(1,'STARTING');
    
    $self->setT1('tFINISH');
    
    # comprobar si tienen el mismo tamaño
    if (!$self->alignment->is_flush()) {
          $logger->error("Sequences in alignment don't have the same size, perhaps they are not properly alignned.");
          # si no tiene el mismo tamaño, salir
          return;
    }
    
    $logger->info("Alignments max length: ".$self->alignment->length);
    $logger->info("Number of sequences found in alignment: " . $self->alignment->no_sequences);
    
    # comprobar numero secuencias en el align
    if ($self->alignment->no_sequences() < 2 ) {
      $logger->error("Insuficient number of sequences (".$self->alignment->no_sequences().")");
      # continuar en el proximo alineamiento
      return;
    }
    
    
    
    
    $self->setT1('tPARSING');
    $self->incStages(1,'PARSING');
    # Construir tabla de frecuencias de letras
    my $countAM= AM::TCountAM->new($self);

    # establecer elemento en la clase
    $self->countAM($countAM);
    
    # imprime el alfabeto 
    $logger->info("Detected alphabet: " . $self->alphabet);
    
    
    $logger->info("Frequency processing finalized");
    $self->setT2('tPARSING');

    $self->setT1('tCONSENSUS');
    $self->incStages(1,'CONSENSUS');
    # # printHashOfArray('Count',$count->count());
    $self->calculateConsensus(1);
    # printArray('consensus',$self->consensus());
    
    $logger->info("Consensus calculated");
    $self->setT2('tCONSENSUS');
    
    my $numSeq=$self->alignment->no_sequences();
    
    # dependiendo del alfabeto se calculan unas funciones u otras
    if ($self->alphabet eq 'dna') {

          $self->setT1('tF1');
          $self->incStages(1,'ADNW GRAPH');
    #     # calcula y representa f1    
          my $f1=AM::TFunction1AM->new($self,"adnW");
          # printArray('f1',$f1->array());
          $f1->graph();
          $self->setT2('tF1');
                  
          $self->setT1('tF2');
          $self->incStages(1,'GENERALW GRAPH');
          # $logger->info("Limits f1: ". $f1->limit1.','.$f1->limit2."\n");
          
          
          my @keys = $self->countAM->keyList;
          
          if ($#keys>4) {
            $matrix=AM::TMatrixAM->new('simple.matrix');
          }else{
            $matrix=AM::TMatrixAM->new('identity.matrix');
          }
          
          my $f2=AM::TFunction2AM->new($self,"generalW",$matrix);
          # printArray('f2',$f2->array());
          $f2->graph();
          # $logger->info("Limits f2: ". $f2->limit1.','.$f2->limit2 ."\n");
          $self->setT2('tF2');
          
          $self->setT1('tF3');
          $self->incStages(1,'ENTROPY GRAPH');
          # $matrix=AM::TMatrixAM->new('simple.matrix');
          
          my $f3=AM::TFunction3AM->new($self,"entropy",$matrix);
          # printArray('f3',$f3->array());
          $f3->graph();
          # $logger->info("Limits f3: ". $f3->limit1.','.$f3->limit2."\n");
          $self->setT2('tF3');
          
          $self->setT1('tF4');
          $self->incStages(1,'VARIABILITY GRAPH');
          my $f4=AM::TFunction4AM->new($self,"variability");
          $f4->graph();
          $self->setT2('tF4');
          
    } elsif ($self->alphabet eq 'protein') {        
      
        $self->setT1('tF2');
        $self->incStages(2,'GENERALW GRAPH');
        $matrix=AM::TMatrixAM->new('BLOSUM62.matrix');
        my $f2=AM::TFunction2AM->new($self,"generalW",$matrix);
        # printArray('f2',$f2->array());
        $f2->graph();
        # $logger->info("Limits f2: ". $f2->limit1.','.$f2->limit2."\n");
        $self->setT2('tF2');
        
        $self->setT1('tF3');
        $self->incStages(1,'ENTROPY GRAPH');
        $matrix=AM::TMatrixAM->new('BLOSUM62.matrix');
        my $f3=AM::TFunction3AM->new($self,"entropy",$matrix);
        
        # printArray('f3',$f3->array());
        $f3->graph();
        # $logger->info("Limits f3: ". $f3->limit1.','.$f3->limit2."\n");
        $self->setT2('tF3');
        
        $self->setT1('tF4');
        $self->incStages(1,'VARIABILITY GRAPH');
        my $f4=AM::TFunction4AM->new($self,"variability");
        $f4->graph();
        $self->setT2('tF4');
        
    }
    # 
    
    $self->incStages(1,'DONE');
    
    $self->setT2('tFINISH');
    
}#process

#-----------------------------------------------------------------------------#

=head2 extractAlphabet

 Title   : extractAlphabet
 Usage   : my $variable = extractAlphabet();
 
 Function: extract de alignment alphabet

 Returns : alphabet
 Args    : none

=cut

#-----------------------------------------------------------------------------#
sub extractAlphabet_and_slice {
  my $self = shift;
  # (my $) = @_;
  # body...
  
  my $logger = get_logger();
    
  my $start = 0;
  my $end = 0;
  
 
  $self->{_alphabet} = 'dna';
  
  # for each sequence
  for (my $seqindex = 1; $seqindex <= $self->alignment->no_sequences(); $seqindex++) {

    my $seq = $self->alignment->get_seq_by_pos($seqindex);
    
    my $seqStr = $seq->seq();
    
    # convierte a mayusculas
    $seqStr =~ tr/a-z/A-Z/;
    
    # Si contiene algo distinto de esto, es proteina
    if ($seqStr =~ m/[^ARGCYTMNSKNX\.\*-]/) {
      $self->{_alphabet} = 'protein';
    }

  
    # check start of alignment
    $seqStr =~ /^([\.\*-]*)/;
   
    if ((defined($1)) and (length($1) > $start)){
      $start = length($1);
    }
    
    # check end of alignment
    $seqStr =~ /([\.\*-]*)$/;
   
    if ((defined($1)) and (length($1) > $end)){
      $end = length($1);
    }
    
  }

  $logger->info("Extracted alphabet: " . $self->alphabet);
  
  if ($start>0 or $end>0){
  
    $end = $self->alignment->length - $end;
    
    if ($start < $end){
      $self->{_left_slice}=$start;
      #$self->alignment=$self->alignment->slice($start,$end);
      $self->{_alignment} = $self->alignment->slice($start+1,$end);
    }
    
    $logger->info("Sliced alignment: [ " . $start . " - " . $end." ]");
    
   }
   
   
  return $self->{_alphabet};
  
}#extractAlphabet

1;  # so the require or use succeeds
   

