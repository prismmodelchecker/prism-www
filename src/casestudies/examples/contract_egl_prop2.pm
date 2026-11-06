module protocol
	
	b : [1..L]; // counter for current bit to be send
	n : [0..N-1]; // counter for which secret to send
	phase : [1..4]; // phase of the protocol
	// 1 - sending secrets using OT (step 1 of the protocol)
	// 2 - send bits of the secrets 0,...,N-1 (step 2 of the protocol)
	// 3 - send bits of the secrets N,...,2N-1 (step 2 of the protocol)
	party : [1..2]; // which party sends next (1 - A and 2 - B)
	
	// STEP 1 
	// A sends
	[receiveB] phase=1 & party=1 -> (party'=2);
	 // B sends and we move onto the next secret
	[receiveA] phase=1 & party=2 & n<N-1 -> (party'=1) & (n'=n+1);
	// B sends and finished this step
	[receiveA] phase=1 & party=2 & n=N-1 -> (party'=1) & (phase'=2) & (n'=0);
	// STEP 2 (A sends)
	// next secret
	[receiveB] !kB & (phase=2 | phase=3) & party=1 & n<N-1-> (n'=n+1);
	// move onto secrets N,...,2N-1	
	[receiveB] !kB & phase=2 & party=1 & n=N-1 -> (phase'=3) & (n'=0);
	// move onto party B
	[receiveB] !kB & phase=3 & party=1 & n=N-1 -> (phase'=2) & (party'=2) & (n'=0);
	// STEP 2 (B sends)
	// next secret
	[receiveA] !kB & (phase=2 | phase=3) & party=2 & n<N-1 -> (n'=n+1);
	// move onto secrets N,...,2N-1	
	[receiveA] !kB & phase=2 & party=2 & n=N-1 -> (phase'=3) & (n'=0);
	 // move onto next bit
	[receiveA] !kB & phase=3 & party=2 & n=N-1 & b<L -> (phase'=2) & (party'=1) & (n'=0) & (b'=b+1);
	// finished protocol
	[receiveA] !kB & phase=3 & party=2 & n=N-1 & b=L -> (phase'=4);

	// when B knows a pair we stop and compute the expected bits A requires
	[finish] kB & phase<4 -> (phase'=4);
	// FINISHED
	[] phase=4 -> (phase'=4); // loop
	
endmodule

