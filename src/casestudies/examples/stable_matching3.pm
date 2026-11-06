// stable roommates example [KKW08]
// gxn 15/04/10

// we construct the model as a set of modules run in parallel, where each module corresponds to
// an agent and where the actions correspond to satisfying blocking pairs

// for example action eij corresponds to the current matching being updated due to agent i
// and j being a blocking pair, therefore the action should only be possible if both
// i and j satisfy the conditions of a blocking pair (this is indeed the case as the guards in
// the modules of agents i and j for action eij when combined match the condition of a blocking pair

// since satisfying a blocking pair can change the matching of other agents, we include these
// actions in the other agents so they can update there matching accordingly

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
// agent i prefers j over k if aij>aik

const int a12=8;
const int a13=7;
const int a14=6;
const int a16=5;
const int a15=4;
const int a17=3;
const int a18=2;
const int a11=1;

const int a23=8;
const int a21=7;
const int a24=6;
const int a25=5;
const int a26=4;
const int a28=3;
const int a27=2;
const int a22=1;

const int a31=8;
const int a32=7;
const int a34=6;
const int a35=5;
const int a36=4;
const int a37=3;
const int a38=2;
const int a33=1;

const int a46=8;
const int a43=7;
const int a45=6;
const int a41=5;
const int a42=4;
const int a47=3;
const int a48=2;
const int a44=1;

const int a54=8;
const int a57=7;
const int a51=6;
const int a52=5;
const int a53=4;
const int a56=3;
const int a58=2;
const int a55=1;

const int a67=8;
const int a64=7;
const int a62=6;
const int a63=5;
const int a61=4;
const int a65=3;
const int a68=2;
const int a66=1;

const int a75=8;
const int a76=7;
const int a71=6;
const int a72=5;
const int a73=4;
const int a74=3;
const int a78=2;
const int a77=1;

const int a83=8;
const int a88=7;
const int a81=6;
const int a82=5;
const int a87=4;
const int a84=3;
const int a85=2;
const int a86=1;

//------------------------------------------------------
// constants used in renaming
const int N1=1;
const int N2=2;
const int N3=3;
const int N4=4;
const int N5=5;
const int N6=6;
const int N7=7;
const int N8=8;
	
//------------------------------------------------------
// module for first agent
module agent1

	// current matching (start alone)
	a1 : [1..8] init N1;

	// wants to change matching
	[e12] a1=0 | (a1=N1 & a12>a11)|(a1=N2 & a12>a12)|(a1=N3 & a12>a13)|(a1=N4 & a12>a14)|(a1=N5 & a12>a15)|(a1=N6 & a12>a16)|(a1=N7 & a12>a17)|(a1=N8 & a12>a18) -> (a1'=N2);
	[e13] a1=0 | (a1=N1 & a13>a11)|(a1=N2 & a13>a12)|(a1=N3 & a13>a13)|(a1=N4 & a13>a14)|(a1=N5 & a13>a15)|(a1=N6 & a13>a16)|(a1=N7 & a13>a17)|(a1=N8 & a13>a18) -> (a1'=N3);
	[e14] a1=0 | (a1=N1 & a14>a11)|(a1=N2 & a14>a12)|(a1=N3 & a14>a13)|(a1=N4 & a14>a14)|(a1=N5 & a14>a15)|(a1=N6 & a14>a16)|(a1=N7 & a14>a17)|(a1=N8 & a14>a18) -> (a1'=N4);
	[e15] a1=0 | (a1=N1 & a15>a11)|(a1=N2 & a15>a12)|(a1=N3 & a15>a13)|(a1=N4 & a15>a14)|(a1=N5 & a15>a15)|(a1=N6 & a15>a16)|(a1=N7 & a15>a17)|(a1=N8 & a15>a18) -> (a1'=N5);
	[e16] a1=0 | (a1=N1 & a16>a11)|(a1=N2 & a16>a12)|(a1=N3 & a16>a13)|(a1=N4 & a16>a14)|(a1=N5 & a16>a15)|(a1=N6 & a16>a16)|(a1=N7 & a16>a17)|(a1=N8 & a16>a18) -> (a1'=N6);
	[e17] a1=0 | (a1=N1 & a17>a11)|(a1=N2 & a17>a12)|(a1=N3 & a17>a13)|(a1=N4 & a17>a14)|(a1=N5 & a17>a15)|(a1=N6 & a17>a16)|(a1=N7 & a17>a17)|(a1=N8 & a17>a18) -> (a1'=N7);
	[e18] a1=0 | (a1=N1 & a18>a11)|(a1=N2 & a18>a12)|(a1=N3 & a18>a13)|(a1=N4 & a18>a14)|(a1=N5 & a18>a15)|(a1=N6 & a18>a16)|(a1=N7 & a18>a17)|(a1=N8 & a18>a18) -> (a1'=N8);
	
	// one of the other pairs change so may need to update matching
	[e23] true -> (a1'=(a1=N2 | a1=N3)?N1:a1);
	[e24] true -> (a1'=(a1=N2 | a1=N4)?N1:a1);
	[e25] true -> (a1'=(a1=N2 | a1=N5)?N1:a1);
	[e26] true -> (a1'=(a1=N2 | a1=N6)?N1:a1);
	[e27] true -> (a1'=(a1=N2 | a1=N7)?N1:a1);
	[e28] true -> (a1'=(a1=N2 | a1=N8)?N1:a1);
	[e34] true -> (a1'=(a1=N3 | a1=N4)?N1:a1);
	[e35] true -> (a1'=(a1=N3 | a1=N5)?N1:a1);
	[e36] true -> (a1'=(a1=N3 | a1=N6)?N1:a1);
	[e37] true -> (a1'=(a1=N3 | a1=N7)?N1:a1);
	[e38] true -> (a1'=(a1=N3 | a1=N8)?N1:a1);
	[e45] true -> (a1'=(a1=N4 | a1=N5)?N1:a1);
	[e46] true -> (a1'=(a1=N4 | a1=N6)?N1:a1);
	[e47] true -> (a1'=(a1=N4 | a1=N7)?N1:a1);
	[e48] true -> (a1'=(a1=N4 | a1=N8)?N1:a1);
	[e56] true -> (a1'=(a1=N5 | a1=N6)?N1:a1);
	[e57] true -> (a1'=(a1=N5 | a1=N7)?N1:a1);
	[e58] true -> (a1'=(a1=N5 | a1=N8)?N1:a1);
	[e67] true -> (a1'=(a1=N6 | a1=N7)?N1:a1);
	[e68] true -> (a1'=(a1=N6 | a1=N8)?N1:a1);
	[e78] true -> (a1'=(a1=N7 | a1=N8)?N1:a1);

endmodule

// construct further agents through renaming
module agent2=agent1[a1=a2, a11=a22, N1=N2, e12=e23, e13=e24, e14=e25, e15=e26, e16=e27, e17=e28, e18=e12, a12=a23, N2=N3, e23=e34, e24=e35, e25=e36, e26=e37, e27=e38, e28=e13, a13=a24, N3=N4, e34=e45, e35=e46, e36=e47, e37=e48, e38=e14, a14=a25, N4=N5, e45=e56, e46=e57, e47=e58, e48=e15, a15=a26, N5=N6, e56=e67, e57=e68, e58=e16, a16=a27, N6=N7, e67=e78, e68=e17, a17=a28, N7=N8, e78=e18, a18=a21, N8=N1 ] endmodule
module agent3=agent1[a1=a3, a11=a33, N1=N3, e12=e34, e13=e35, e14=e36, e15=e37, e16=e38, e17=e13, e18=e23, a12=a34, N2=N4, e23=e45, e24=e46, e25=e47, e26=e48, e27=e14, e28=e24, a13=a35, N3=N5, e34=e56, e35=e57, e36=e58, e37=e15, e38=e25, a14=a36, N4=N6, e45=e67, e46=e68, e47=e16, e48=e26, a15=a37, N5=N7, e56=e78, e57=e17, e58=e27, a16=a38, N6=N8, e67=e18, e68=e28, a17=a31, N7=N1, e78=e12, a18=a32, N8=N2 ] endmodule
module agent4=agent1[a1=a4, a11=a44, N1=N4, e12=e45, e13=e46, e14=e47, e15=e48, e16=e14, e17=e24, e18=e34, a12=a45, N2=N5, e23=e56, e24=e57, e25=e58, e26=e15, e27=e25, e28=e35, a13=a46, N3=N6, e34=e67, e35=e68, e36=e16, e37=e26, e38=e36, a14=a47, N4=N7, e45=e78, e46=e17, e47=e27, e48=e37, a15=a48, N5=N8, e56=e18, e57=e28, e58=e38, a16=a41, N6=N1, e67=e12, e68=e13, a17=a42, N7=N2, e78=e23, a18=a43, N8=N3 ] endmodule
module agent5=agent1[a1=a5, a11=a55, N1=N5, e12=e56, e13=e57, e14=e58, e15=e15, e16=e25, e17=e35, e18=e45, a12=a56, N2=N6, e23=e67, e24=e68, e25=e16, e26=e26, e27=e36, e28=e46, a13=a57, N3=N7, e34=e78, e35=e17, e36=e27, e37=e37, e38=e47, a14=a58, N4=N8, e45=e18, e46=e28, e47=e38, e48=e48, a15=a51, N5=N1, e56=e12, e57=e13, e58=e14, a16=a52, N6=N2, e67=e23, e68=e24, a17=a53, N7=N3, e78=e34, a18=a54, N8=N4 ] endmodule
module agent6=agent1[a1=a6, a11=a66, N1=N6, e12=e67, e13=e68, e14=e16, e15=e26, e16=e36, e17=e46, e18=e56, a12=a67, N2=N7, e23=e78, e24=e17, e25=e27, e26=e37, e27=e47, e28=e57, a13=a68, N3=N8, e34=e18, e35=e28, e36=e38, e37=e48, e38=e58, a14=a61, N4=N1, e45=e12, e46=e13, e47=e14, e48=e15, a15=a62, N5=N2, e56=e23, e57=e24, e58=e25, a16=a63, N6=N3, e67=e34, e68=e35, a17=a64, N7=N4, e78=e45, a18=a65, N8=N5 ] endmodule
module agent7=agent1[a1=a7, a11=a77, N1=N7, e12=e78, e13=e17, e14=e27, e15=e37, e16=e47, e17=e57, e18=e67, a12=a78, N2=N8, e23=e18, e24=e28, e25=e38, e26=e48, e27=e58, e28=e68, a13=a71, N3=N1, e34=e12, e35=e13, e36=e14, e37=e15, e38=e16, a14=a72, N4=N2, e45=e23, e46=e24, e47=e25, e48=e26, a15=a73, N5=N3, e56=e34, e57=e35, e58=e36, a16=a74, N6=N4, e67=e45, e68=e46, a17=a75, N7=N5, e78=e56, a18=a76, N8=N6 ] endmodule
module agent8=agent1[a1=a8, a11=a88, N1=N8, e12=e18, e13=e28, e14=e38, e15=e48, e16=e58, e17=e68, e18=e78, a12=a81, N2=N1, e23=e12, e24=e13, e25=e14, e26=e15, e27=e16, e28=e17, a13=a82, N3=N2, e34=e23, e35=e24, e36=e25, e37=e26, e38=e27, a14=a83, N4=N3, e45=e34, e46=e35, e47=e36, e48=e37, a15=a84, N5=N4, e56=e45, e57=e46, e58=e47, a16=a85, N6=N5, e67=e56, e68=e57, a17=a86, N7=N6, e78=e67, a18=a87, N8=N7 ] endmodule

//------------------------------------------------------
// reward structure: expected rounds
rewards "rounds"
	true : 1;
endrewards
