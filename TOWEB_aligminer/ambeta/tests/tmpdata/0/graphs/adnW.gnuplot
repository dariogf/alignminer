set term png size 2500,400
set key right top outside
set output "/srv/www/htdocs/alignminer/tmpdata/1210697813344/graphs/adnW.png"
set xlabel "Position" 
set ylabel "Similarity" 
plot  "/srv/www/htdocs/alignminer/tmpdata/1210697813344/data/adnW.data" using 1:2 title 'adnW' with lines lc rgb "red" , 0.919663597839335 title 'Lim 1' with lines lw 2 lc rgb "dark-red" , 1.08033640216067 title 'Lim 2' with lines lw 2 lc rgb "dark-red" , "/srv/www/htdocs/alignminer/tmpdata/1210697813344/data/adnWfft.data" using 1:2 title 'adnWfft' with lines lc rgb "green" , 0.993345728961534 title 'Lim 1 FFT' with lines lw 2 lc rgb "dark-green" , 1.00665427103847 title 'Lim 2 FFT' with lines lw 2 lc rgb "dark-green"
quit
