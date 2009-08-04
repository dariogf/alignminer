#!/usr/bin/env ruby

require 'json'

if ARGV.count!=2
puts "USO: get_stats.rb origen destino"
exit
end

origen=ARGV[0]
ls=`ls #{origen}*/data/STAT*`
destino=ARGV[1]+'/'

`mkdir #{destino}`

dirs=ls.split("\n")


dirs.each do |d|

	id = d.split('/')[0]

	t=File.open("#{id}/json/alignInfo.json").read
        alignInfo=JSON.parse(t)	

	#puts "cp #{d} #{destino}#{alignInfo['jobName']}_STATS.txt"

	`cp #{d} #{destino}#{alignInfo['jobName']}_STATS.txt`

end
