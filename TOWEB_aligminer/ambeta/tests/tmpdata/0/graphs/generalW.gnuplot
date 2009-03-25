set term png size 2500,400
set key right top outside
set output "/srv/www/htdocs/alignminer/tmpdata/1210697813344/graphs/generalW.png"
set xlabel "Position" 
set ylabel "Similarity" 
plot  "/srv/www/htdocs/alignminer/tmpdata/1210697813344/data/generalW.data" using 1:2 title 'generalW' with lines lc rgb "red" , 8.2593252629243 title 'Lim 1' with lines lw 2 lc rgb "dark-red" , 9.7406747370757 title 'Lim 2' with lines lw 2 lc rgb "dark-red" , "/srv/www/htdocs/alignminer/tmpdata/1210697813344/data/generalWfft.data" using 1:2 title 'generalWfft' with lines lc rgb "green" , 8.94670349190944 title 'Lim 1 FFT' with lines lw 2 lc rgb "dark-green" , 9.05329650809056 title 'Lim 2 FFT' with lines lw 2 lc rgb "dark-green"
quit
