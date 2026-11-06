dtmc

const double psend =1;
const double precv ;

module scheduler
turn: bool init true;

[tick] !turn ->(turn' = true);
[tock] turn  -> (turn'= false);
endmodule

// first horizontal
module chan01
buff01: [0..1] init 0;

[tock] send0=1 | send1= 1 -> precv:(buff01'=1)+ (1-precv):(buff01'=0);
[tock] send0!=1 & send1!=1 -> (buff01'=0);
endmodule

module chan12
buff12: [0..1] init 0;

[tock] send1=1 | send2= 1 -> precv:(buff12'=1)+ (1-precv):(buff12'=0);
[tock] send1!=1 & send2!=1 -> (buff12'=0);
endmodule

// first vertical
module chan03
buff03: [0..1] init 0;

[tock] send0=1 | send3= 1 -> precv:(buff03'=1)+ (1-precv):(buff03'=0);
[tock] send0!=1 & send3!=1 -> (buff03'=0);
endmodule


module chan14
buff14: [0..1] init 0;

[tock] send1=1 | send4= 1 -> precv:(buff14'=1)+ (1-precv):(buff14'=0);
[tock] send1!=1 & send4!=1 -> (buff14'=0);
endmodule


module chan25
buff25: [0..1] init 0;

[tock] send2=1 | send5= 1 -> precv:(buff25'=1)+ (1-precv):(buff25'=0);
[tock] send2!=1 & send5!=1 -> (buff25'=0);
endmodule


// second horizontal
module chan34
buff34: [0..1] init 0;

[tock] send3=1 | send4= 1 -> precv:(buff34'=1)+ (1-precv):(buff34'=0);
[tock] send3!=1 & send4!=1 -> (buff34'=0);
endmodule

module chan45
buff45: [0..1] init 0;

[tock] send4=1 | send5= 1 -> precv:(buff45'=1)+ (1-precv):(buff45'=0);
[tock] send4!=1 & send5!=1 -> (buff45'=0);
endmodule

// second vertical
module chan36
buff36: [0..1] init 0;

[tock] send3=1 | send6= 1 -> precv:(buff36'=1)+ (1-precv):(buff36'=0);
[tock] send3!=1 & send6!=1 -> (buff36'=0);
endmodule


module chan47
buff47: [0..1] init 0;

[tock] send4=1 | send7= 1 -> precv:(buff47'=1)+ (1-precv):(buff47'=0);
[tock] send4!=1 & send7!=1 -> (buff47'=0);
endmodule


module chan58
buff58: [0..1] init 0;

[tock] send5=1 | send8= 1 -> precv:(buff58'=1)+ (1-precv):(buff58'=0);
[tock] send5!=1 & send8!=1 -> (buff58'=0);
endmodule


// second horizontal
module chan67
buff67: [0..1] init 0;

[tock] send6=1 | send7= 1 -> precv:(buff67'=1)+ (1-precv):(buff67'=0);
[tock] send6!=1 & send7!=1 -> (buff67'=0);
endmodule

module chan78
buff78: [0..1] init 0;

[tock] send7=1 | send8= 1 -> precv:(buff78'=1)+ (1-precv):(buff78'=0);
[tock] send7!=1 & send8!=1 -> (buff78'=0);
endmodule


// nodes


module node0
active0:[0..1] init 1;
send0:  [0..1] init 0;

[tick] active0=1 & send0=0 -> psend:(active0'=1)&(send0'=1)+(1-psend):(active0'=0)&(send0'=0);
[tick] active0=1 & send0=1 -> (send0'=0)& (active0'=0);
[tick] active0=0  -> (send0'=0)& (active0'=0);
endmodule


module node1
active1:[0..1] init 1;
send1:  [0..1] init 0;

[tick] active1=1 & send1=0 &  1=(buff01 +buff12 +buff14)-> psend:(active1'=1)&(send1'=1)+(1-psend):(active1'=0)&(send1'=0);
[tick] active1=1 & send1=0 &  1!=(buff01 +buff12 +buff14) -> (active1'=1)& (send1'=0);
[tick] active1=1 & send1=1 -> (send1'=0)& (active1'=0);
[tick] active1=0 -> (send1'=0)& (active1'=0);
endmodule

module node2
active2:[0..1] init 1;
send2:  [0..1] init 0;

[tick] active2=1 & send2=0 &  1=(buff12 +buff25) -> psend:(active2'=1)&(send2'=1)+(1-psend):(active2'=0)&(send2'=0);
[tick] active2=1 & send2=0 & 1!=(buff12 +buff25) -> (active2'=1)& (send2'=0);
[tick] active2=1 & send2=1    -> (send2'=0)& (active2'=0);
[tick] active2=0  -> (send2'=0)& (active2'=0);
endmodule

module node3
active3:[0..1] init 1;
send3:  [0..1] init 0;

[tick] active3=1 & send3=0 &  1=(buff03 +buff34 +buff36) -> psend:(active3'=1)&(send3'=1)+(1-psend):(active3'=0)&(send3'=0);
[tick] active3=1 & send3=0 & 1!=(buff03 +buff34 +buff36) -> (active3'=1)& (send3'=0);
[tick] active3=1 & send3=1    -> (send3'=0)& (active3'=0);
[tick] active3=0  -> (send3'=0)& (active3'=0);
endmodule

module node4
active4:[0..1] init 1;
send4:  [0..1] init 0;

[tick] active4=1 & send4=0 &  1=(buff14 +buff34 +buff45 +buff47) -> psend:(active4'=1)&(send4'=1)+(1-psend):(active4'=0)&(send4'=0);
[tick] active4=1 & send4=0 & 1!=(buff14 +buff34 +buff45 +buff47) -> (active4'=1) & (send4'=0);
[tick] active4=1 & send4=1 -> (send4'=0)& (active4'=0);
[tick] active4=0  -> (send4'=0)& (active4'=0);
endmodule


module node5
active5:[0..1] init 1;
send5:  [0..1] init 0;

[tick] active5=1 & send5=0 &  1=(buff25 +buff45 +buff58) -> psend:(active5'=1)&(send5'=1)+(1-psend):(active5'=0)&(send5'=0);
[tick] active5=1 & send5=0 & 1!=(buff25 +buff45 +buff58) -> (active5'=1) & (send5'=0);
[tick] active5=1 & send5=1 -> (send5'=0)& (active5'=0);
[tick] active5=0  -> (send5'=0)& (active5'=0);
endmodule


module node6
active6:[0..1] init 1;
send6:  [0..1] init 0;

[tick] active6=1 & send6=0 & 1=(buff36 +buff67) -> psend:(active6'=1)&(send6'=1)+(1-psend):(active6'=0)&(send6'=0);
[tick] active6=1 & send6=0 & 1!=(buff36 +buff67) -> (active6'=1) & (send6'=0);
[tick] active6=1 & send6=1    -> (send6'=0)& (active6'=0);
[tick] active6=0  -> (send6'=0)& (active6'=0);
endmodule

module node7
active7:[0..1] init 1;
send7:  [0..1] init 0;

[tick] active7=1 & send7=0 &  1=(buff67 +buff47 +buff78) -> psend:(active7'=1)&(send7'=1)+(1-psend):(active7'=0)&(send7'=0);
[tick] active7=1 & send7=0 & 1!=(buff67 +buff47 +buff78) -> (active7'=1) & (send7'=0);
[tick] active7=1 & send7=1    -> (send7'=0)& (active7'=0);
[tick] active7=0  -> (send7'=0)& (active7'=0);
endmodule

module node8
active8:[0..1] init 1;
send8:  [0..1] init 0;

[tick] active8=1 & send8=0 &  1=(buff58 +buff78) -> psend:(active8'=1)&(send8'=1)+(1-psend):(active8'=0)&(send8'=0);
[tick] active8=1 & send8=0 & 1!=(buff58 +buff78) -> (active8'=1) & (send8'=0);
[tick] active8=1 & send8=1    -> (send8'=0)& (active8'=0);
[tick] active8=0  -> (send8'=0)& (active8'=0);
endmodule
