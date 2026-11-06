// stable marriage example [GS62]
// gxn 15/04/10

// we construct the model as a set of modules run in parallel, where each module corresponds to
// one man or one woman and where the actions correspond to satisfying blocking pairs

// for example action eij corresponds to the current matching being updated due to man i
// and woman j being a blocking pair, therefore the action should only be possible if both
// man i and woman j satisfy the conditions of a blocking pair
// this is indeed the case as the guards in the modules of man i and woman j for action eij
// when combined match the condition of a blocking pair

// since satisfying a blocking pair can change the matching of other agents, we include these
// actions in the other agents so they can update there matching accordingly
// for example if eij is performed and woman k was mached with man i, then after
// satisfying the blocking pair woman k will not be matched
// on the other hand if woman k was not matched with man i, then nothing would change

// since PRISM automatically normalises the transition probabilities when constructing DTMCs,
// by giving each transition probability 1 (the default value so no probability needs to be
// verified), in the constructed model there will be a uniform probabilistic over the enabled transitions
// i.e. a uniform probabilistic choice between the current block pairs which corresponds precisely
// with the "better response dynamics" of Ackermann et al. [AGM+08] and the "unperturbed blocking dynamics"
// of Klaus et al. [KKW08] 

// note we do not add loops in stable matchings, as using the fact that the stable matchings
// are deadlocks states (states with no outgoing transitions) we can use the label "deadlock"
// to specify the stable matchings, and hence simplify the specification of properties

dtmc // model is a DTMC/Markov chain

//------------------------------------------------------
// PREFERENCE LISTS
// man i prefers woman j over woman k if mij>mik
// woman i prefers man j over man k if wij>wik

// preference list for men
const int m11=3;
const int m12=2;
const int m13=1;

const int m22=3;
const int m23=2;
const int m21=1;

const int m33=3;
const int m31=2;
const int m32=1;

// preference list for women
const int w12=3;
const int w13=2;
const int w11=1;

const int w23=3;
const int w21=2;
const int w22=1;

const int w31=3;
const int w32=2;
const int w33=1;

//------------------------------------------------------
// constants used in renaming
const int N1=1;
const int N2=2;
const int N3=3;

//------------------------------------------------------
// module for first man
module man1

	// current matching (0 means no matching)
	m1 : [0..3];

	// wants to change matching
	[e11] m1=0 | (m1=1 & m11>m11)|(m1=2 & m11>m12)|(m1=3 & m11>m13) -> (m1'=1);
	[e12] m1=0 | (m1=1 & m12>m11)|(m1=2 & m12>m12)|(m1=3 & m12>m13) -> (m1'=2);
	[e13] m1=0 | (m1=1 & m13>m11)|(m1=2 & m13>m12)|(m1=3 & m13>m13) -> (m1'=3);
	
	// one of the other pairs change so may need to reset matching
	[e21] true -> (m1'=(m1=1)?0:m1);
	[e31] true -> (m1'=(m1=1)?0:m1);
	[e22] true -> (m1'=(m1=2)?0:m1);
	[e32] true -> (m1'=(m1=2)?0:m1);
	[e23] true -> (m1'=(m1=3)?0:m1);
	[e33] true -> (m1'=(m1=3)?0:m1);
	
endmodule

// construct further men through renaming
module man2=man1[m1=m2, m11=m21, e11=e21, e12=e22, e13=e23, m12=m22, e21=e31, e22=e32, e23=e33, m13=m23, e31=e11, e32=e12, e33=e13 ] endmodule
module man3=man1[m1=m3, m11=m31, e11=e31, e12=e32, e13=e33, m12=m32, e21=e11, e22=e12, e23=e13, m13=m33, e31=e21, e32=e22, e33=e23 ] endmodule

//------------------------------------------------------
// module for first woman
module woman1

	// do not need to store the matching (can work it out from the men's variables)

	// man 1 wants to change
	[e11] ( m1!=N1 & m2!=N1 & m3!=N1 ) | (m1=N1 & w11>w11)|(m2=N1 & w11>w12)|(m3=N1 & w11>w13) -> true;
	[e21] ( m1!=N1 & m2!=N1 & m3!=N1 ) | (m1=N1 & w12>w11)|(m2=N1 & w12>w12)|(m3=N1 & w12>w13) -> true;
	[e31] ( m1!=N1 & m2!=N1 & m3!=N1 ) | (m1=N1 & w13>w11)|(m2=N1 & w13>w12)|(m3=N1 & w13>w13) -> true;
	
endmodule

// construct further women through renaming
module woman2=woman1[ N1=N2, w11=w21, e11=e12, e21=e22, e31=e32, w12=w22, e12=e13, e22=e23, e32=e33, w13=w23, e13=e11, e23=e21, e33=e31 ] endmodule
module woman3=woman1[ N1=N3, w11=w31, e11=e13, e21=e23, e31=e33, w12=w32, e12=e11, e22=e21, e32=e31, w13=w33, e13=e12, e23=e22, e33=e32 ] endmodule

//------------------------------------------------------
// reward structure: expected rounds
rewards "rounds"

	true : 1;
endrewards
