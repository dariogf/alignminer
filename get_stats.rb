#!/usr/bin/env ruby

require 'json'

ls=`ls */data/STAT*`
destino='stats/'

dirs=ls.split("\n")


dirs.each do |d|

	id = d.split('/')[0]

	t=File.open("#{id}/json/alignInfo.json").read
        alignInfo=JSON.parse(t)	

	#puts "cp #{d} #{destino}#{alignInfo['jobName']}_STATS.txt"

	`cp #{d} #{destino}#{alignInfo['jobName']}_STATS.txt`

end
