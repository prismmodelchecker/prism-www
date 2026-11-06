// Synchronous leader election protocol  (Itai & Rodeh)

dtmc

// CONSTANTS
const N = 3; // Number of processes
const K = 2; // Range of probabilistic choice

// 3 processes in a ring. Process i reads from process i+1.

// Process 1
module process1
	
	// Local state: 0=choosing id, 1=reading, 2=deciding, 3=finished
	s1 : [0..3];
	// Random id
	p1 : [0..K-1];
	// Value to be sent to next process in the ring
	v1 : [0..K-1];
	// Has a unique id so far?
	u1 : bool;
	
	// Pick value
	[pick] s1=0 -> 1/K : (s1'=1) & (p1'=0) & (v1'=0) & (u1'=true)
	             + 1/K : (s1'=1) & (p1'=1) & (v1'=1) & (u1'=true);
	// Read
	[read] s1=1 & c<N-1 -> (u1'=u1&(p1!=v2)) & (v1'=v2);
	// Read and move to decide
	[read] s1=1 & c=N-1 -> (s1'=2) & (u1'=u1&(p1!=v2));
	// Deciding...
	// Done
	[done] s1=2 -> (s1'=3);
	// Retry
	[retry] s1=2 -> (s1'=0) & (u1'=false) & (v1'=0) & (p1'=0);
	// Loop (when finished to avoid deadlocks)
	[loop] s1=3 -> (s1'=3);
	
endmodule

// Construct remaining processes through renaming
module process2 = process1 [ s1=s2,p1=p2,v1=v2,u1=u2,v2=v3 ] endmodule
module process3 = process1 [ s1=s3,p1=p3,v1=v3,u1=u3,v2=v1 ] endmodule

// Counter module used to count the number of processes that have been read
// and to know when a process has decided
module counter
	
	// Counter (c=i means process j reading process (i-1)+j next)
	c : [1..N-1];
	
	// Reading
	[read] c<N-1 -> (c'=c+1);
	// Finished reading
	[read] c=N-1 -> (c'=c);
	// Decide
	[done] u1|u2|u3 -> (c'=c);
	// Pick again, reset counter 
	[retry] !(u1|u2|u3) -> (c'=1);

endmodule

// Labels
label "elected" = s1=3&s2=3&s3=3;

// Expected number of rounds
rewards "num_rounds"
	[pick] true : 1;
endrewards
