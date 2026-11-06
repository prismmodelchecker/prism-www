// Simple dice game

dtmc

module player1

    // Local state
    s1 : [0..2] init 0;
    // Die value
    x : [0..6] init 0;

    // Throw die (just once)
    [toss1] s1=0 -> 1/6:(x'=1)&(s1'=1) + 1/6:(x'=2)&(s1'=1) + 1/6:(x'=3)&(s1'=1)
                  + 1/6:(x'=4)&(s1'=1) + 1/6:(x'=5)&(s1'=1) + 1/6:(x'=6)&(s1'=1);
    // Signal we are finished
    [done1] s1=1 -> (s1'=2);
    // Finished: loop
    [loop] s1=2 -> (s1'=2);

endmodule

module player2

    // Local state: 
    s2 : [0..2] init 0;
    // Die value
    y : [0..6] init 0;

    // Start game (once player 1 is done)
    [done1] s2=0 ->(s2'=1);
    // Throw die (just once)
    [toss2] s2=1 -> 1/6:(y'=1)&(s2'=2) + 1/6:(y'=2)&(s2'=2) + 1/6:(y'=3)&(s2'=2)
                  + 1/6:(y'=4)&(s2'=2) + 1/6:(y'=5)&(s2'=2) + 1/6:(y'=6)&(s2'=2);
    // Finished: loop
    [loop] s2=2 -> (s2'=2);
    
endmodule
