dtmc
// Which processes initially have a copy of the data
// Dn is true if process n does
    const bool D1 = true;
const bool D2 = false;
const bool D3 = false;
// An identity index for each process (helps renaming)
    const int ID1 = 1;
const int ID2 = 2;
const int ID3 = 3;
const double q;
module P1
s1 : [0..3] init 0; // local state: step of the algorithm
d1 : bool init D1; // whether process has the data
    t1 : [0..3] init 0; // which process to send to (0=no-one)
// Decide whether to send
[step1] s1=0 & d1 -> ...
[step1] s1=0 & !d1 -> ...
// Pick a recipient (if required)
[step2] s1=1 -> ...
[step2] s1=2 -> ...
// Send/receive data from other processes
// (then, reset t1 and start the next round)
[step3] s1=3 -> (s1'=0) & (d1'=d1|(t2=ID1|t3=ID1)) & (t1'=0);
endmodule
module P2 = P1 [ s1=s2, d1=d2, t1=t2, t2=t1, D1=D2, ID1=ID2 ] endmodule
module P3 = P1 [ s1=s3, d1=d3, t1=t3, t3=t1, D1=D3, ID1=ID3 ] endmodule
