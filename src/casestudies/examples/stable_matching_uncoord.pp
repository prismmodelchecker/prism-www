// stable marriage uncoord instance
// gxn 17/04/10

#const N#

dtmc

//------------------------------------------------------
// PREFERENCE LISTS
// man i prefers woman j over woman k if mij>mik
// woman i prefers man j over man k if wij>wik

// preference list for men
#for i=1:N#
#for j=1:N#
const int m#i##j#=#N-mod((N-1)-((j-1)-i),N)#;
#end#

#end#

// preference list for women
#for i=1:N#
#for j=1:N#
const int w#i##j#=#mod((N-1)-((i-1)-j),N)+1#;
#end#

#end#

//------------------------------------------------------
// constants used in renaming
#for i=1:N#
const int N#i#=#i#;
#end#

//------------------------------------------------------
// module for first man
module man1

	// current preferences (0 means no preference)
	m1 : [0..#N#];

	// man 1 wants to change
	#for i=1:N#
	[e1#i#] m1=0 | #| j=1:N#(m1=#j# & m1#i#>m1#j#)#end# -> (m1'=#i#);
	#end#
	
	// one of the other pairs change so may need to reset its choice
	#for i=1:N#
	#for j=2:N#
	[e#j##i#] true -> (m1'=(m1=#i#)?0:m1);
	#end#
	#end#
	
endmodule

// construct further men through renaming
#for i=2:N#
module man#i#=man1[m1=m#i#, #, j=1:N# m1#j#=m#i##j#, #, k=1:N# e#j##k#=e#mod(j-1+i-1,N)+1##k# #end##end# ] endmodule
#end#

//------------------------------------------------------
// module for first woman
module woman1

	// do not need a preference (can work it out from the men's preference)

	// man 1 wants to change
	#for i=1:N#
	[e#i#1] (#& j=1:N# m#j#!=N1 #end#) | #| j=1:N#(m#j#=N1 & w1#i#>w1#j#)#end# -> true;
	#end#
	
endmodule

// construct further women through renaming
#for i=2:N#
module woman#i#=woman1[ N1=N#i#, #, j=1:N# w1#j#=w#i##j#, #, k=1:N# e#k##j#=e#k##mod(j-1+i-1,N)+1# #end##end# ] endmodule
#end#

//------------------------------------------------------
// initial states: all complete matching
init
	#& i=1:N##& j=i+1:N# m#i#!=m#j# #end# #end# // each man is matched to a diiferent woman
	#& i=1:N# m#i#>0 #end# // all men are matched
endinit
//------------------------------------------------------
// reward structure: expected steps
rewards "rounds"
	true : 1;
endrewards
