# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TBaseFunction - Clase que encapsula un alineamiento 

=head1 SYNOPSIS

    use AM::TBaseFunction;

    # creando el objeto
    my $obj = AM::TBaseFunction->new($alignAM,$name);
    

=head1 DESCRIPTION

AM::ALignAM 

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TBaseFunctionAM;

use strict;

use Log::Log4perl qw(get_logger);

use base qw(AM::TAMObject);

use Math::FFT;

use AM::TRegionListAM;

use Utils::Stats qw(:All);

use Utils::SaveFiles qw(:All);

use Utils::Printing qw(:All);

use alignminer_h qw(:All);

#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TBaseFunctionAM->new($alignAM,$name);
 
 Function: Constructor del objeto.

 Returns : TBaseFunctionAM Object
 Args    : $alignAM: TAlignAM Object
           $name: nombre de la función

=cut

#-----------------------------------------------------------------------------#
sub new {
        my $class = shift;
        # print "init class : \n";
        my ($alignAM,$name,$matrixAM) = @_;
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        
        $self->{_alignAM} = $alignAM;
        $self->{_name} = $name;
        $self->{_matrixAM}= $matrixAM;
        $self->{_array} = ();
        $self->{_arrayfft} = ();
        $self->{_limit1} = undef;
        $self->{_limit2} = undef;
        $self->{_medianA} = undef;
        $self->{_limit1FFT} = undef;
        $self->{_limit2FFT} = undef;
        
        $self->{_belowRegionList} = undef;
        $self->{_aboveRegionList} = undef;
        $self->{_belowRegionListFFT} = undef;
        $self->{_aboveRegionListFFT} = undef;
        $self->{_snpRegionList} = undef;
        $self->{_snpRegionListFFT} = undef;
        
        
        $self->{_xlabel}   = 'Position';
        $self->{_ylabel}   = 'Similarity';
        
        # cambia el tipo del hash por el de la clase
        bless ($self, $class);
        
        $self->_calculate();
        
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

=head2 name

    Used to set or get the value of name

=cut

#-----------------------------------------------------------------------------#
sub name {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_name} = $param if defined($param);

   return $self->{_name};
}

#-----------------------------------------------------------------------------#

=head2 alignment

    Used to set or get the value of alignAMObject

=cut

#-----------------------------------------------------------------------------#
sub alignAM {
   my $self = shift;
   
   $self->{_alignAM} = shift if (@_);
   return $self->{_alignAM};
}

#-----------------------------------------------------------------------------#

=head2 values

    Used to set or get the value of values

=cut

#-----------------------------------------------------------------------------#
sub array {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_array} = $param if defined($param);
   
   return @{$self->{_array}};
}

#-----------------------------------------------------------------------------#

=head2 arrayfft

    Used to set or get the value of arrayfft

=cut

#-----------------------------------------------------------------------------#
sub arrayfft {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_arrayfft} = $param if defined($param);

   return @{$self->{_arrayfft}};
}


#-----------------------------------------------------------------------------#

=head2 matrixAM

    Used to set or get the value of matrixAM

=cut

#-----------------------------------------------------------------------------#
sub matrixAM {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_matrixAM} = $param if defined($param);

   return $self->{_matrixAM};
}

#-----------------------------------------------------------------------------#

=head2 limit1

    Used to set or get the value of limit1

=cut

#-----------------------------------------------------------------------------#
sub limit1 {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_limit1} = $param if defined($param);

   return $self->{_limit1};
}

#-----------------------------------------------------------------------------#

=head2 limit2

    Used to set or get the value of limit2

=cut

#-----------------------------------------------------------------------------#
sub limit2 {
   my $self = shift;
   
   my ( $param ) = @_;
   $self->{_limit2} = $param if defined($param);

   return $self->{_limit2};
}


#-----------------------------------------------------------------------------#

=head2 medianA

    Used to set or get the value of medianA

=cut

#-----------------------------------------------------------------------------#
sub medianA {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_medianA} = $param if defined($param);

   return $self->{_medianA};
}


#-----------------------------------------------------------------------------#

=head2 limit1FFT

    Used to set or get the value of limit1FFT

=cut

#-----------------------------------------------------------------------------#
sub limit1FFT {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_limit1FFT} = $param if defined($param);

   return $self->{_limit1FFT};
}

#-----------------------------------------------------------------------------#

=head2 limit2FFT

    Used to set or get the value of limit2FFT

=cut

#-----------------------------------------------------------------------------#
sub limit2FFT {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_limit2FFT} = $param if defined($param);

   return $self->{_limit2FFT};
}


#-----------------------------------------------------------------------------#

=head2 snpRegionList

    Used to set or get the value of snpRegionList

=cut

#-----------------------------------------------------------------------------#
sub snpRegionList {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_snpRegionList} = $param if defined($param);

   return $self->{_snpRegionList};
}


#-----------------------------------------------------------------------------#

=head2 snpRegionListFFT

    Used to set or get the value of snpRegionListFFT

=cut

#-----------------------------------------------------------------------------#
sub snpRegionListFFT {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_snpRegionListFFT} = $param if defined($param);

   return $self->{_snpRegionListFFT};
}


#-----------------------------------------------------------------------------#

=head2 aboveRegionListFFT

    Used to set or get the value of aboveRegionListFFT

=cut

#-----------------------------------------------------------------------------#
sub aboveRegionListFFT {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_aboveRegionListFFT} = $param if defined($param);

   return $self->{_aboveRegionListFFT};
}

#-----------------------------------------------------------------------------#

=head2 belowRegionListFFT

    Used to set or get the value of belowRegionListFFT

=cut

#-----------------------------------------------------------------------------#
sub belowRegionListFFT {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_belowRegionListFFT} = $param if defined($param);

   return $self->{_belowRegionListFFT};
}


#-----------------------------------------------------------------------------#

=head2 aboveRegionList

    Used to set or get the value of aboveRegionList

=cut

#-----------------------------------------------------------------------------#
sub aboveRegionList {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_aboveRegionList} = $param if defined($param);

   return $self->{_aboveRegionList};
}

#-----------------------------------------------------------------------------#

=head2 belowRegionList

    Used to set or get the value of belowRegionList

=cut

#-----------------------------------------------------------------------------#
sub belowRegionList {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_belowRegionList} = $param if defined($param);

   return $self->{_belowRegionList};
}

#-----------------------------------------------------------------------------#

=head2 xlabel

    Used to set or get the value of xlabel

=cut

#-----------------------------------------------------------------------------#
sub xlabel {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_xlabel} = $param if defined($param);

   return $self->{_xlabel};
}

#-----------------------------------------------------------------------------#

=head2 ylabel

    Used to set or get the value of ylabel

=cut

#-----------------------------------------------------------------------------#
sub ylabel {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_ylabel} = $param if defined($param);

   return $self->{_ylabel};
}


##############################################
##                 Functions                ##
##############################################

#-----------------------------------------------------------------------------#

=head2 _calculate

 Title   : _calculate
 Usage   : private only: $self->_calculate();
 
 Function: Itera por los elementos del alineamiento para calcular la función

 Returns : la función calculada
 Args    : ninguno

=cut

#-----------------------------------------------------------------------------#
sub _calculate {
    my $self = shift;
    # (my $) = @_;
    my $logger = get_logger();
    
    my $matrixname='.';
    
    if (defined($self->matrixAM)){
        $matrixname=", using ".$self->matrixAM->fileName;
    }
    
    $logger->info("Calculating Function ".$self->name."$matrixname\n");
    
    my $e;
    my @a;
    
    # $self->values(@a);
    my $nseq = $self->alignAM->numOfSequences;    
    my @consensusArray = $self->alignAM->consensus();
    
    # para toda la longitud de la secuencia.
    # $i representa el índice en la longitud
    for (my $i = 0; $i < $self->alignAM->alignment->length(); $i++) {
        
        $e=$self->evaluatePos($i,$nseq,$consensusArray[$i]);

        $a[$i]=$e;
          
          # 
          # $a[$i]=sprintf("%.3f", $e);
          # # convierte a número, para que JSON no ponga el array con comillas "1.23"
          # $a[$i]+=0; 
        
        # sin redondear
        # $a[$i]=$e;
        
        if ($i % 4000 == 0) {
            $logger->info("Calculating [$i], wait...");
        }
        
    }
    
    # print "array:".join(':',@a)."\n";
    $self->array(\@a);
    
    # antes guardaba aqui
    
    # calcula límites
    $self->calculateLimits();
    
    
    my @afft = $self->fft(@a);
    # printArray(@afft,'fft');
    $self->arrayfft(\@afft);
    
    # antes guardaba aqui
    
    # calcula límites FFT
    $self->calculateLimitsFFT();
    
    # TODO - Repasar límites de regiones
    
    # regiones para normal
    my $below = AM::TRegionListAM->new($self->name.'_below',sub {$_[0]<=$_[1]},$self->limit1,$self->alignAM,0,\@a);
    my $above = AM::TRegionListAM->new($self->name.'_above',sub {$_[0]>=$_[1]},$self->limit2,$self->alignAM,0,\@a);
    
    my $snp = AM::TRegionListAM->new($self->name.'_snp',sub {$_[0]<=$_[1]},$self->limit1,$self->alignAM,1,\@a);
    
    
    $self->belowRegionList($below);
    $self->aboveRegionList($above);
    $self->snpRegionList($snp);
    
    # SHOW-DONE -Mostrar nuevas regiones con corte mad(FFT), 
    
    # regiones para fft
    my $belowFFT = AM::TRegionListAM->new($self->name.'_belowFFT',sub {$_[0]<=$_[1]},$self->limit1FFT,$self->alignAM,0,\@afft,$below);
    my $aboveFFT = AM::TRegionListAM->new($self->name.'_aboveFFT',sub {$_[0]>=$_[1]},$self->limit2FFT,$self->alignAM,0,\@afft,$above);
    
    # ASK-DONE - Los SNP creo que solo se calculan sin FFT
    # my $snpFFT = AM::TRegionListAM->new($self->name.'_snpFFT',sub  {$_[0]>=$_[1]},$self->limit2FFT,$self->alignAM,1,@afft);
    
    $self->belowRegionListFFT($belowFFT);
    $self->aboveRegionListFFT($aboveFFT);
    # $self->snpRegionListFFT{$snpFFT};
    
    # guardaResultados
    
    
    # add left slice to array
    my @left_slice = ();
    
    # add the left_sliced part
    for (my $i = 0; $i <= $self->alignAM->left_slice(); $i++) {
      push(@left_slice,$self->limit1FFT);
    }
    
    # add the function data
    push(@left_slice,@a);
    
    $logger->info("Filling from ".$self->alignAM->alignment->length." to " .$self->alignAM->original_length() );
    my $test=0;
    # add the rigth sliced part
    for (my $i = $self->alignAM->alignment->length; $i <= $self->alignAM->original_length(); $i++) {
      push(@left_slice,$self->limit1FFT);
      $test++;
    }
    $logger->info("Filled: $test");
    
    @a=@left_slice;

    # convert to number
    for (my $i = 0; $i <= $#a; $i++) {
      $a[$i]=sprintf("%.3f", $a[$i]);
      $a[$i]+=0; # convertir a numero para guardado en json correcto
    }
    
    
    # guarda a JSON
    saveToJSON("$JSON_OUTPUT_DIR".$self->name.".json",\@a);
    
     
    # add left slice to array
    @left_slice = ();         
    
    # add the left_sliced part    
    for (my $i = 0; $i <= $self->alignAM->left_slice(); $i++) {
      push(@left_slice,$self->limit1FFT);
    }
    
    # add fft data
    push(@left_slice,@afft);
     
    # add right part
    for (my $i = $self->alignAM->alignment->length; $i <= $self->alignAM->original_length(); $i++) {
      push(@left_slice,$self->limit1FFT);
    }
    
    @afft=@left_slice;

    
    # convert to number 
    for (my $i = 0; $i <= $#afft; $i++) {
      $afft[$i]=sprintf("%.3f", $afft[$i]);
      $afft[$i]+=0; # convertir a numero para guardado en json correcto
    }
    
    
    # guarda a JSON
    saveToJSON("$JSON_OUTPUT_DIR".$self->name."fft.json",\@afft);
            
}#calculate


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
    (my $i) = @_;
    
    # ASK-DONE - Parece interesante usar :> median(f2) +- std(f2)
    
    my $value=-100;
    
    return $value;
}#evaluatePos


#-----------------------------------------------------------------------------#

=head2 graph

 Title   : graph
 Usage   : $f->graph();
 
 Function: Representa la funcion graficamente

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub graph {
    my $self = shift;
    
    # proceso eliminado porque ya no era necesario
    
    # my $graphAM=AM::TGraphAM->new($self->name,$self->xlabel,$self->ylabel);
    #     my @a = $self->array();
    #     my @afft = $self->arrayfft();
    #     
    #     $graphAM->addGraphComponent('array',\@a,$self->name,"red");
    #     $graphAM->addGraphComponent('limit',$self->limit1,'Lim 1',"dark-red");
    #     $graphAM->addGraphComponent('limit',$self->limit2,'Lim 2',"dark-red");
    #     
    #     $graphAM->addGraphComponent('array',\@afft,$self->name."fft","green");    
    #     $graphAM->addGraphComponent('limit',$self->limit1FFT,'Lim 1 FFT',"dark-green");
    #     $graphAM->addGraphComponent('limit',$self->limit2FFT,'Lim 2 FFT',"dark-green");
    #     
    #     $graphAM->doPaint();
    #     
    #     saveToMatlab("$MATLAB_OUTPUT_DIR" . $self->name() . ".m",$self->name(),@a);
    #     saveToMatlab("$MATLAB_OUTPUT_DIR" . $self->name() . "fft.m",$self->name()."fft",@afft);
    #     
    
}#graph

#-----------------------------------------------------------------------------#

=head2 calculateLimits

 Title   : calculateLimits
 Usage   : $self->calculateLimits();
 
 Function: Calcula los límites de interés calculados a partir de la MAD

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub calculateLimits {
    my $self = shift;
    
    # (my @a) = @_;
    
    my @a = $self->array;
    
    my $logger = get_logger();
    
    $logger->info("Calculating Limits");
    
    # calcula mad con medianas
    my ($mad,$med) = mad_median(@a);
    $logger->info("     ". $self->name.": [MAD_MEDIAN:$mad,MED:$med]\n");
    # my $rmad=0;
    # my $rmed=0;
    my $mea;
    
    # my $desv=$mad;

    # si la mad con medianas es 0, usa la mad de medias
    if ($mad==0) {
        ($mad,$mea) = mad_mean(@a);
        $logger->info("     MAD == 0 in ". $self->name.": [MAD_MEAN:$mad,MED:$med]\n");

    }
    
    # SHOW-DONE -La $DESV con 2* quizá sea demasiado restrictiva.
    my $desv=1.4826*$mad;
        
    # guarda los limites ordenados limit1 es el menor
    if ($med-$desv<=$med+$desv) {
        $self->limit1($med-$desv);
        $self->limit2($med+$desv);
    }else{
        $self->limit1($med+$desv);
        $self->limit2($med-$desv);
    }
    
    # guarda la mediana para el calculo de limites FFT
    
    $self->medianA($med);
    
    $logger->info("Limits ". $self->name.": [". $self->limit1.','.$self->limit2."]\n");
    
    my %limits;
    
    $limits{limit1}=$self->limit1;
    $limits{limit2}=$self->limit2;
    
    saveToJSON("$JSON_OUTPUT_DIR".$self->name."_LIMIT.json",\%limits);
    
}#calculateLimits

#-----------------------------------------------------------------------------#

=head2 calculateLimitsFFT

 Title   : calculateLimitsFFT
 Usage   : $self->calculateLimitsFFT();
 
 Function: Calcula los límites de interés calculados a partir de la MAD

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub calculateLimitsFFT {
    my $self = shift;
    
    my ($medianA) = @_;
    
    my @a = $self->arrayfft;
    
    my $logger = get_logger();
    
    $logger->info("Calculating Limits FFT");
    
    # calcula mad con medianas
    my ($mad,$med) = mad_median(@a);
    $logger->info("     ". $self->name.": [MAD_MEDIAN FFT:$mad,MED FFT:$med]\n");
    # my $rmad=0;
    # my $rmed=0;
    my $mea;
    
    # my $desv=$mad;

    # si mad es 0, calcular con la media
    if ($mad==0) {
        ($mad,$mea) = mad_mean(@a);
        $logger->info("     MAD FFT == 0 in ". $self->name.": [MAD_MEAN FFT:$mad,MED FFT:$med]\n");
        
    }
    
    my $desv=1.4826*$mad;
    
    
    # if ($mad == 0) {
    #     ($rmad,$rmed)=rmad($self->name."rmad",@a);
    #     print "using rmad";
    # }
    
    # print "Mad:$mad, med:$med, desv:$desv, rmad: $rmad,rmed:$rmed\n";
       
    # if ($mad == 0) {
    #     $desv=1.4826*$mad;
    # }
    
    
    # guarda los limites ordenados limit1 es el menor
    
    # ASK-DONE -Creo que aquí podríamos usar la median de los datos son FFT para centar el intervalo respecto a los otros límites.

    $med = $self->medianA;
    
    if ($med-$desv<=$med+$desv) {
        $self->limit1FFT($med-$desv);
        $self->limit2FFT($med+$desv);
    }else{
        $self->limit1FFT($med+$desv);
        $self->limit2FFT($med-$desv);
    }
    
    $logger->info("Limits FFT ". $self->name.": [". $self->limit1FFT.','.$self->limit2FFT."]\n");
    
    my %limitsFFT;
    
    $limitsFFT{limit1FFT}=$self->limit1FFT;
    $limitsFFT{limit2FFT}=$self->limit2FFT;
    
 saveToJSON("$JSON_OUTPUT_DIR".$self->name."_LIMIT_FFT.json",\%limitsFFT);
    
}#calculateLimitsFFT



#-----------------------------------------------------------------------------#

=head2 fft

 Title   : fft - de ajlara: Antonio Lara 
 Usage   : $self->fft(@serie);
 Function: Calcula la transformada, le aplica un filtro paso baja y hace la
           transformada inversa. 
 Returns : Array con los valores del resultado.
 Args    : Array con los valores de la serie.

=cut

sub fft {
    my $self = shift;
    
    my @serie = @_;
    my @coeff_pb = ();
    my ($fft, $coeff, $invff);
    my ($i, $elem, $x, $inc);
    my $longitud = $#serie;

    # se rellena con 0 hasta que el numero de elementos sea potencia de dos
    $i = 1;
    
    while (@serie > $i) {
        $i = $i * 2;
    }
    
    while (@serie <= $i-1) {
        push @serie, 0;
    }
    
    # calcula la transformada (real)
    $fft = Math::FFT->new(\@serie);
    $coeff = $fft->rdft();
    
    # filtro paso baja
    @coeff_pb = @{$coeff};
    $inc = 2 / (@coeff_pb - @coeff_pb/4);
    $x = 1;
    for ($i=@coeff_pb/4; $i<@coeff_pb; $i+=2) {
        $coeff_pb[$i] = $coeff_pb[$i] * ($x ** 8);
        $coeff_pb[$i+1] = $coeff_pb[$i+1] * ($x ** 8);
        $x = $x - $inc;
    }
    $coeff_pb[1] = 0;
    
    # transformada inversa
    $invff = $fft->invrdft(\@coeff_pb);
    $invff->[0] = $serie[0]; # mantenemos el primer elemento
    $invff->[$longitud] = $serie[$longitud]; # mantenemos el ultimo elemento

    return @{$invff}[0 .. $longitud];
} #transformada

1;  # so the require or use succeeds
