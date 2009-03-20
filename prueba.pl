#!/usr/bin/perl -w
### param1 param2

use strict;
use warnings;

use JSON;

my $t1 = time;

my %hash = (
  foo => 'bar',
  1   => 2,
  this => 'that',
  );
  
# {"1":2,"foo":"bar","this":"that"}

my @a1 = (1,2,3,"lago");

# [1,2,3,"lago"]

my @a;

push(@a,\%hash);
push(@a,\%hash);
push(@a,\%hash);

my $js = to_json(\@a);

my $t2 = time;



print "Content-type: text/javascript\n\n";
print $js;

print $t2-$t1,',',localtime($t2-$t1);

# my $res = '[';
# my $j = '';
# 
# foreach my $h (@a) {
#     print "$h";
#     my %h1 = $h;
#     $res .= $j. to_json(\%h1);
# }
# 
# $res .= ']';
# 
# print $res;