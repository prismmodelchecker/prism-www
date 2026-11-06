// Randomised protocol for signing contracts taken from:
// S. Even, O. Goldreich, and A. Lempel.
// A randomized protocol for signing contracts.
// Communications of the ACM, 28(6):637 647, 1985.

// employs ordering 2 for secrets/messages (EGL2)

// note that: certain variables that belong to a party appear in the other party's module
// as this leads to a more structured model (without this PRISM runs out of memory)

//-----------------------------------------------------------------------------------------

probabilistic // model is a DTMC (no non-determinism)


// CONSTANTS
// number of secrets the party sends (vary during verification)
const int N;
// number of bits in each secret (fix at 2)
const int L=2;

// FORMULAE
// true when B knows a pair of secrets
formula kB = ( (a1_0=L  & a2_0=L)
			 | (a1_1=L  & a2_1=L)
			 | (a1_2=L  & a2_2=L)
			 | (a1_3=L  & a2_3=L)
			 | (a1_4=L  & a2_4=L)
			 | (a1_5=L  & a2_5=L)
			 | (a1_6=L  & a2_6=L)
			 | (a1_7=L  & a2_7=L)
			 | (a1_8=L  & a2_8=L)
			 | (a1_9=L  & a2_9=L));
// true when A knows a pair of secrets
formula kA = ( (b1_0=L  & b2_0=L)
			 | (b1_1=L  & b2_1=L)
			 | (b1_2=L  & b2_2=L)
			 | (b1_3=L  & b2_3=L)
			 | (b1_4=L  & b2_4=L)
			 | (b1_5=L  & b2_5=L)
			 | (b1_6=L  & b2_6=L)
			 | (b1_7=L  & b2_7=L)
			 | (b1_8=L  & b2_8=L)
			 | (b1_9=L  & b2_9=L));

//-----------------------------------------------------------------------------------------
// module used to order the sending of messages
module scheduler
	
	b : [1..L]; // counter to keep track of the number of bits that have been sent
	n : [0..max(N-1,1)]; // counter to keep track of the number of concurrent messages a party has sent
	phase : [1..5]; // counter to record the current phase of the protocol
	// 1   - first phase of the protocol (sending messages of the form OT(.,.,.,.)
	// 2&3 - second phase of the protocol (sending secretes 1..n and n+1..2n respectively)
	// 4   - finished the protocol
	party : [1..2]; // counter to keep track of which party moves next
	
	// FIRST PHASE
	[receiveB] phase=1 & party=1 -> (party'=2); // first A sends a message then B does
	[receiveA] phase=1 & party=2 & n<N-1 -> (party'=1) & (n'=n+1); // move onto the next message
	[receiveA] phase=1 & party=2 & n=N-1 -> (party'=1) & (phase'=2) & (n'=0); // B sends his/her final message: move to next phase


	// SECOND AND THIRD PHASES
	// A sends bth bit of secrets 1,...,N
	[receiveB] phase=2 & party=1 & n<N-1-> (n'=n+1); // next secret
	[receiveB] phase=2 & party=1 & n=N-1 -> (phase'=2) & (party'=2) & (n'=0); // next B sends jth bit of secrets 1,...,N
	// B sends bth bit of secrets 1,...,N
	[receiveA] phase=2 & party=2 & n<N-1 -> (n'=n+1); // next secret
	[receiveA] phase=2 & party=2 & n=N-1 -> (phase'=3) & (party'=1) & (n'=0); // next A sends bth bit of secrets N+1,...,2N
	// A sends bth bit of secrets N+1,...,2N
	[receiveB] phase=3 & party=1 & n<N-1-> (n'=n+1); // next secret
	[receiveB] phase=3 & party=1 & n=N-1 -> (phase'=3) & (party'=2) & (n'=0); // next B sends jth bit of secrets N+1,...,2N
	// B sends bth bit of secrets N+1,...,2N
	[receiveA] phase=3 & party=2 & n<N-1 -> (n'=n+1); // next secret
	[receiveA] phase=3 & party=2 & n=N-1 & b<L -> (phase'=2) & (party'=1) & (n'=0) & (b'=b+1); // next A sends b+1th bit
	[receiveA] phase=3 & party=2 & n=N-1 & b=L -> (phase'=4); // finished all bits (protocol finished)

	// FINISHED
	[] phase=4 -> (phase'=4); // loop
	
endmodule

// party A
module partyA
	
	// bi_j the number of bits of B's i*jth secret A knows 
	// (keep pairs of secrets together to give a more structured model)
	b1_0  : [0..L]; b2_0 : [0..L];
	b1_1  : [0..L]; b2_1 : [0..L];
	b1_2  : [0..L]; b2_2 : [0..L];
	b1_3  : [0..L]; b2_3 : [0..L];
	b1_4  : [0..L]; b2_4 : [0..L];
	b1_5  : [0..L]; b2_5 : [0..L];
	b1_6  : [0..L]; b2_6 : [0..L];
	b1_7  : [0..L]; b2_7 : [0..L];
	b1_8  : [0..L]; b2_8 : [0..L];
	b1_9  : [0..L]; b2_9 : [0..L];
	
	
	// first step (get either secret i or (N-1)+i with equal probability)
	[receiveA] phase=1 & n=0  -> 0.5 : (b1_0'=L)  + 0.5 : (b2_0'=L);
	[receiveA] phase=1 & n=1  -> 0.5 : (b1_1'=L)  + 0.5 : (b2_1'=L);
	[receiveA] phase=1 & n=2  -> 0.5 : (b1_2'=L)  + 0.5 : (b2_2'=L);
	[receiveA] phase=1 & n=3  -> 0.5 : (b1_3'=L)  + 0.5 : (b2_3'=L);
	[receiveA] phase=1 & n=4  -> 0.5 : (b1_4'=L)  + 0.5 : (b2_4'=L);
	[receiveA] phase=1 & n=5  -> 0.5 : (b1_5'=L)  + 0.5 : (b2_5'=L);
	[receiveA] phase=1 & n=6  -> 0.5 : (b1_6'=L)  + 0.5 : (b2_6'=L);
	[receiveA] phase=1 & n=7  -> 0.5 : (b1_7'=L)  + 0.5 : (b2_7'=L);
	[receiveA] phase=1 & n=8  -> 0.5 : (b1_8'=L)  + 0.5 : (b2_8'=L);
	[receiveA] phase=1 & n=9  -> 0.5 : (b1_9'=L)  + 0.5 : (b2_9'=L);
	// second step (secrets 0,...,N-1)
	[receiveA] phase=2 & n=0  -> (b1_0'=min(b1_0+1,L));
	[receiveA] phase=2 & n=1  -> (b1_1'=min(b1_1+1,L));
	[receiveA] phase=2 & n=2  -> (b1_2'=min(b1_2+1,L));
	[receiveA] phase=2 & n=3  -> (b1_3'=min(b1_3+1,L));
	[receiveA] phase=2 & n=4  -> (b1_4'=min(b1_4+1,L));
	[receiveA] phase=2 & n=5  -> (b1_5'=min(b1_5+1,L));
	[receiveA] phase=2 & n=6  -> (b1_6'=min(b1_6+1,L));
	[receiveA] phase=2 & n=7  -> (b1_7'=min(b1_7+1,L));
	[receiveA] phase=2 & n=8  -> (b1_8'=min(b1_8+1,L));
	[receiveA] phase=2 & n=9  -> (b1_9'=min(b1_9+1,L));
	// second step (secrets N,...,2N-1)
	[receiveA] phase=3 & n=0  -> (b2_0'=min(b2_0+1,L));
	[receiveA] phase=3 & n=1  -> (b2_1'=min(b2_1+1,L));
	[receiveA] phase=3 & n=2  -> (b2_2'=min(b2_2+1,L));
	[receiveA] phase=3 & n=3  -> (b2_3'=min(b2_3+1,L));
	[receiveA] phase=3 & n=4  -> (b2_4'=min(b2_4+1,L));
	[receiveA] phase=3 & n=5  -> (b2_5'=min(b2_5+1,L));
	[receiveA] phase=3 & n=6  -> (b2_6'=min(b2_6+1,L));
	[receiveA] phase=3 & n=7  -> (b2_7'=min(b2_7+1,L));
	[receiveA] phase=3 & n=8  -> (b2_8'=min(b2_8+1,L));
	[receiveA] phase=3 & n=9  -> (b2_9'=min(b2_9+1,L));

endmodule

// construct module for party B through renaming
module partyB=partyA[b1_0=a1_0 ,b1_1=a1_1 ,b1_2=a1_2 ,b1_3=a1_3 ,b1_4=a1_4 ,b1_5=a1_5 ,b1_6=a1_6 ,b1_7=a1_7 ,b1_8=a1_8 ,b1_9=a1_9,
                     b2_0=a2_0 ,b2_1=a2_1 ,b2_2=a2_2 ,b2_3=a2_3 ,b2_4=a2_4 ,b2_5=a2_5 ,b2_6=a2_6 ,b2_7=a2_7 ,b2_8=a2_8 ,b2_9=a2_9,
                     receiveA=receiveB] 
endmodule
