#const N#
mdp

module proc1
	s1: [0..1];
	[] true -> (s1'=1-s1);
endmodule

#for i=2:N#
module proc#i# = proc1 [ s1=s#i# ] endmodule
#end#

