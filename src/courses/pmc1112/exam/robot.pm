dtmc

module controller

	// Controller state
	c : [0..3] init 0;

	// Make (random) choice
	[choose] c=0 -> 1/3:(c'=1) + 1/3:(c'=2) + 1/3:(c'=3);
	// Execute chosen command
	[explore] c=1 -> (c'=0);
	[process] c=2 -> (c'=0);
	[discard] c=3 -> (c'=0);

endmodule

const int N; // Number of samples
const double p_find = 0.5; // Prob. of successful explore
const double p_fail = 0.05; // Prob. of sample processing failure

module robot

	// Robot state: 0=idle; 1=has sample; 2=processing sample
	r : [0..2] init 0;
	// Num samples processed
	proc : [0..N] init 0;
	// Num successes
	succ : [0..N] init 0;

	// Command 'explore' received:
	[explore] r=0 & proc<N -> p_find:(r'=1) + (1-p_find):true;
	// But, if none left to find, do nothing
	[explore] r=0 & proc=N -> true;
	// Or, if we already have a sample, ignore
	[explore] r!=0 -> true;

	// Command 'process' received:
	[process] r=1 -> (r'=2);
	// But, if nothing to process, ignore
	[process] r!=1 -> true;
	// Do processing (one time-step)
	[do] r=2 -> (1-p_fail):(succ'=min(succ+1,N))&(proc'=min(proc+1,N))&(r'=0)
		     + p_fail :(proc'=min(proc+1,N))&(r'=0);
	
	// Command 'discard' received:
	[discard] r=1 -> (r'=0);
	// But, if nothing to discard, ignore
	[discard] r!=1 -> true;

endmodule
