# Dario Guerrero
# =======================
# v0.1  -  2008


=head1 NAME

TGraphAM - Representa una gráfica

=head1 SYNOPSIS

    use AM::TGraphAM;

    # creando el objeto
    my $obj = AM::TGraphAM->new($graphName);

=head1 DESCRIPTION

La clase AM::TGraphAM representa una gráfica

=head1 AUTHOR - Diego Darío Guerrero Fernández

Email dariogf@scbi.uma.es

=head1 APPENDIX

El resto de la documentacion es una descripcion de los metodos implementados.

Los metodos/propiedades internos y privados comienzan con "_".

=cut

package AM::TGraphAM;

use strict;

use Log::Log4perl qw(get_logger);

use base qw(AM::TAMObject);

use Utils::SaveFiles qw(:All);

use alignminer_h qw(:All);

#-----------------------------------------------------------------------------#

=head2 new

 Title   : new
 Usage   : $var=TGraphAM->new();
 
 Function: Constructor del objeto.

 Returns : TGraphAM Object
 Args    : graphName

=cut

#-----------------------------------------------------------------------------#
sub new {
        my $class = shift;
        # print "init class : \n";
        my ($graphName,$xlabel,$ylabel) = @_;
        
        # inicializa con el padre
        my $self = $class->SUPER::new(@_);
        
        # # hash vacio para alojar el objeto
        # my $self  = {};
        my @a;
        
        $self->{_graphName} = $graphName;
        $self->{_xlabel} = $xlabel;
        $self->{_ylabel} = $ylabel;
        $self->{_graphComponents} = \@a;
        
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

#-----------------------------------------------------------------------------#

=head2 graphName

    Used to set or get the value of graphName

=cut

#-----------------------------------------------------------------------------#
sub graphName {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_graphName} = $param if defined($param);
   return $self->{_graphName};
}

#-----------------------------------------------------------------------------#

=head2 graphComponents

    Used to set or get the value of graphComponents

=cut

#-----------------------------------------------------------------------------#
sub graphComponents {
   my $self = shift;
   
   my ( $param ) = @_; 
   $self->{_graphComponents} = $param if defined($param);

   return @{$self->{_graphComponents}};
}


# #-----------------------------------------------------------------------------#
# 
# =head2 dataArrays
# 
#     Used to set or get the value of dataArrays
# 
# =cut
# 
# #-----------------------------------------------------------------------------#
# sub dataArrays {
#    my $self = shift;
#    
#    my ( $param ) = @_; 
#    $self->{_dataArrays} = $param if defined($param);
# 
#    # return $self->{_dataArrays};
#    return @{$self->{_consensus}};
# }

# #-----------------------------------------------------------------------------#
# 
# =head2 limits
# 
#     Used to set or get the value of limits
# 
# =cut
# 
# #-----------------------------------------------------------------------------#
# sub limits {
#    my $self = shift;
#    
#    my ( $param ) = @_; 
#    $self->{_limits} = $param if defined($param);
# 
#    return @{$self->{_limits}};
# }

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

=head2 addArray

 Title   : addArray
 Usage   : $graphAM->addArray(@a);
 
 Function: Añade un array a la grafica, si ya hay arrays añadidos, debe tener el mismo tamaño.

 Returns : @a -> array con los datos en formato double
 Args    : arguments

=cut

#-----------------------------------------------------------------------------#
sub addGraphComponent {
    my $self = shift;
    
    my ($type, $ref, $name, $color ) = @_;
    
    # print "add grcomp:$name\n";
    
    my %component;
    
    $component{'type'}= $type;
    $component{'ref'}= $ref;
    $component{'name'}= $name;
    $component{'color'}=$color;
    
    my @a=$self->graphComponents();
    
    # print "get grcomp:$name\n";
    
    push(@a,\%component);
    
    $self->graphComponents(\@a);
    
    # print "set grcomp:$name\n";
    
    
}#addArray

#-----------------------------------------------------------------------------#

=head2 doPaint

 Title   : doPaint
 Usage   : $graphAM->doPaint();
 
 Function: Pinta los arrays y límites añadidos al objeto.

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub doPaint {
    my $self = shift;
    # (my $) = @_;
    
    # crea el script de dibujado guardando los datos en ficheros
    $self->saveGraphScript;
    
    # (my $id, my @f) = @_;
    my $id = $self->graphName;
    
    # guarda los datos en fichero temporal
    # $self->saveToFile("$OUTPUT_DIR".$id.".data",@a);
    
    # llama al script que hace la grafica con gnuplot
    # `$GNUPLOT_GRAPH_SCRIPT $id $RUNID`;
    
    
    system("$GNUPLOT_PATH", "$GRAPH_OUTPUT_DIR/$id.gnuplot");
    # system("$OPEN_CMD", "/Library/WebServer/Documents/alignminer/tmpdata/$RUNID/graphs/$id.png");
    
    
}#doPaint

#-----------------------------------------------------------------------------#

=head2 saveGraphScript

 Title   : saveGraphScript
 Usage   : $graphAM->saveGraphScript();
 
 Function: Guarda el script de gnuplot para crear la gráfica

 Returns : 
 Args    : 

=cut

#-----------------------------------------------------------------------------#
sub saveGraphScript {
    my $self = shift;
    # (my $) = @_;
        
    my @components = $self->graphComponents;
    my $plotString='plot ';
    
    my $j=' ';
    
    my %h;
    
    my $color;
    my $type;
    my $name;
    my $ref;
    my @a;
    my $lim;
    
    foreach my $e (@components) {
        # es una referencia a hash
        %h=%$e;
        $type=$h{'type'};
        $name=$h{'name'};
        $color=$h{'color'};
        
        if ($type eq 'array'){
            
            @a=@{$h{'ref'}};
            
            # $plotString.=$j.'"$OUTPUT_DIR'.$name.'.data" using 1:2 smooth bezier title \''.$name.'\' with lines';
            
            $plotString.=$j.'"'.$DATA_OUTPUT_DIR.$name.'.data" using 1:2 title \''.$name.'\' with lines lc rgb "'.$color.'"';
            
            
            saveArrayToFile("$DATA_OUTPUT_DIR".$name.".data", @a);
            
            # # guarda a JSON
            #             saveToJSON("$JSON_OUTPUT_DIR".$name.".json",\@a);
            # 
            
        }elsif ($type eq 'limit'){
            $lim=$h{'ref'};
            
            $plotString=$plotString.$j.$lim.' title \''.$name.'\' with lines lw 2 lc rgb "'.$color.'"';
        }
        
        $j=' , ';
        
    }
    
    # print "plots:$plotString\n";
    open (FILE, ">$GRAPH_OUTPUT_DIR".$self->graphName.".gnuplot");
    
    # print FILE "set term png\n";
    # print FILE "set term png size ".($#a*2).",400\n";
    print FILE "set term png size ".(2500).",400\n";
    
    # left, right, top, bottom, outside, and below
    # establece la leyenda
    print FILE "set key right top outside\n";
    
    print FILE 'set output "',$GRAPH_OUTPUT_DIR,$self->graphName,'.png"',"\n";
    
    print FILE 'set xlabel "',$self->xlabel,'" ',"\n"; #0.0,0.0 
    print FILE 'set ylabel "',$self->ylabel,'" ',"\n";
    
    print FILE "$plotString\n";
    
    print FILE "quit\n";
    
    close(FILE);
    
}#saveGraphScript


1;  # so the require or use succeeds

#   List of known color names:
# white              #ffffff = 255 255 255
# black              #000000 =   0   0   0
# gray0              #000000 =   0   0   0
# grey0              #000000 =   0   0   0
# gray10             #1a1a1a =  26  26  26
# grey10             #1a1a1a =  26  26  26
# gray20             #333333 =  51  51  51
# grey20             #333333 =  51  51  51
# gray30             #4d4d4d =  77  77  77
# grey30             #4d4d4d =  77  77  77
# gray40             #666666 = 102 102 102
# grey40             #666666 = 102 102 102
# gray50             #7f7f7f = 127 127 127
# grey50             #7f7f7f = 127 127 127
# gray60             #999999 = 153 153 153
# grey60             #999999 = 153 153 153
# gray70             #b3b3b3 = 179 179 179
# grey70             #b3b3b3 = 179 179 179
# gray80             #cccccc = 204 204 204
# grey80             #cccccc = 204 204 204
# gray90             #e5e5e5 = 229 229 229
# grey90             #e5e5e5 = 229 229 229
# gray100            #ffffff = 255 255 255
# grey100            #ffffff = 255 255 255
# gray               #bebebe = 190 190 190
# grey               #bebebe = 190 190 190
# light-gray         #d3d3d3 = 211 211 211
# light-grey         #d3d3d3 = 211 211 211
# dark-gray          #a9a9a9 = 169 169 169
# dark-grey          #a9a9a9 = 169 169 169
# red                #ff0000 = 255   0   0
# light-red          #f03232 = 240  50  50
# dark-red           #8b0000 = 139   0   0
# yellow             #ffff00 = 255 255   0
# light-yellow       #ffffe0 = 255 255 224
# dark-yellow        #c8c800 = 200 200   0
# green              #00ff00 =   0 255   0
# light-green        #90ee90 = 144 238 144
# dark-green         #006400 =   0 100   0
# spring-green       #00ff7f =   0 255 127
# forest-green       #228b22 =  34 139  34
# sea-green          #2e8b57 =  46 139  87
# blue               #0000ff =   0   0 255
# light-blue         #add8e6 = 173 216 230
# dark-blue          #00008b =   0   0 139
# midnight-blue      #191970 =  25  25 112
# navy               #000080 =   0   0 128
# medium-blue        #0000cd =   0   0 205
# royalblue          #4169e1 =  65 105 225
# skyblue            #87ceeb = 135 206 235
# cyan               #00ffff =   0 255 255
# light-cyan         #e0ffff = 224 255 255
# dark-cyan          #008b8b =   0 139 139
# magenta            #ff00ff = 255   0 255
# light-magenta      #f055f0 = 240  85 240
# dark-magenta       #8b008b = 139   0 139
# turquoise          #40e0d0 =  64 224 208
# light-turquoise    #afeeee = 175 238 238
# dark-turquoise     #00ced1 =   0 206 209
# pink               #ffc0cb = 255 192 203
# light-pink         #ffb6c1 = 255 182 193
# dark-pink          #ff1493 = 255  20 147
# coral              #ff7f50 = 255 127  80
# light-coral        #f08080 = 240 128 128
# orange-red         #ff4500 = 255  69   0
# salmon             #fa8072 = 250 128 114
# light-salmon       #ffa07a = 255 160 122
# dark-salmon        #e9967a = 233 150 122
# aquamarine         #7fffd4 = 127 255 212
# khaki              #f0e68c = 240 230 140
# dark-khaki         #bdb76b = 189 183 107
# goldenrod          #daa520 = 218 165  32
# light-goldenrod    #eedd82 = 238 221 130
# dark-goldenrod     #b8860b = 184 134  11
# gold               #ffd700 = 255 215   0
# beige              #f5f5dc = 245 245 220
# brown              #a52a2a = 165  42  42
# orange             #ffa500 = 255 165   0
# dark-orange        #ff8c00 = 255 140   0
# violet             #ee82ee = 238 130 238
# dark-violet        #9400d3 = 148   0 211
# plum               #dda0dd = 221 160 221
# purple             #a020f0 = 160  32 240
