---
layout: layouts/base.njk
title: "Bounded Retransmission Protocol"
section: casestudies
permalink: /casestudies/brp/
---
# Bounded Retransmission Protocol

(D'Argenio, Jeannet, Jensen & Larsen)

## Contents

-   [Introduction](#intro)
-   [Model Statistics](#stats)
-   [Model Construction Times](#times)
-   [Model Checking](#mc)

## Introduction { #intro }

This case study is based on the bounded retransmission protocol (BRP) {% cite "HSV94" %}, a variant of the alternating bit protocol. The BRP protocol sends a file in a number of chunks, but allows only a bounded number of retransmissions of each chunk. The model is represented as an MDP. We let **N** denote the number of chunks and **MAX** the maximum allowed number of retransmissions of each chunk. The PRISM source code is given below.

{% prismCode "casestudies/examples/brp.pm", false, true %}

We note that, as in {% cite "DJJL01" %}, we have added a checker process which ensures that when checking properties we are only considering the transmission of one file, that is, we are not interested in checking properties after a transmission was successful or unsuccessful.

## Model Statistics { #stats }

The table below shows statistics for each model we have built. The first section gives the number of **states** in the MDP representing the model. The second part refers to the MTBDD which represents this MDP: the total number of **nodes** and the number of **leaves** (terminal nodes).

| N:  | MAX: | Model:  | MTBDD: ||
| ^^  | ^^   | States: | Nodes: | Leaves: |
|-----|------|---------|--------|---------|
| 16  | 2    | 677     | 2,182  | 6       |
| 16  | 3    | 886     | 2,179  | 6       |
| 16  | 4    | 1,095   | 2,237  | 6       |
| 16  | 5    | 1,304   | 2,230  | 6       |

| 32  | 2    | 1,349   | 2,272  | 6       |
| 32  | 3    | 1,766   | 2,269  | 6       |
| 32  | 4    | 2,183   | 2,327  | 6       |
| 32  | 5    | 2,600   | 2,320  | 6       |

| 64  | 2    | 2,693   | 2,362  | 6       |
| 64  | 3    | 3,526   | 2,359  | 6       |
| 64  | 4    | 4,359   | 2,417  | 6       |
| 64  | 5    | 5,192   | 2,410  | 6       |

## Model Construction Times { #times }

The table below gives the times taken to construct the models. There are two stages. Firstly, the system description (in our module based language) is parsed and converted to the MTBDD representing it. Secondly, reachability is performed to identify non-reachable states and the MTBDD is filtered accordingly. Reachability is performed using a BDD based fixpoint algorithm. We give the overall construction time and both the time and iterations for the reachability process.

| N:  | MAX: | Construction: | Reachability: ||
| ^^  | ^^   | Time (s):     | Time (s):     | Iter.s: |
|-----|------|---------------|---------------|---------|
| 16  | 2    | 0.12          | 0.10          | 105     |
| 16  | 3    | 0.12          | 0.11          | 107     |
| 16  | 4    | 0.14          | 0.12          | 109     |
| 16  | 5    | 0.15          | 0.12          | 111     |

| 32  | 2    | 0.22          | 0.22          | 201     |
| 32  | 3    | 0.27          | 0.22          | 203     |
| 32  | 4    | 0.28          | 0.26          | 205     |
| 32  | 5    | 0.28          | 0.25          | 207     |

| 64  | 2    | 0.50          | 0.42          | 393     |
| 64  | 3    | 0.52          | 0.43          | 395     |
| 64  | 4    | 0.55          | 0.43          | 397     |
| 64  | 5    | 0.58          | 0.44          | 399     |

## Model Checking { #mc }

The PRISM source code for the properties considered is given below.

{% prismCode "casestudies/examples/brp.pctl", false, true %}

There are two precomputation steps in the model checking procedure involving BDD based fixpoint algorithms: **Prob0** and **Prob1** which finds those states such that the probability of satisfying the formula is 0 and 1 respectively.

In the main algorithm we use the Jacobi iterative method and stop iterating when the *relative error* between subsequent iteration vectors is less than 1e-6, that is:

![](/images/cs/err.gif)

<a name="propA"></a>

-   **Property A of {% cite "DJJL01" %}:** "The probability the sender reports a certain unsuccessful transmission but the receiver got the complete file."
    
    **Model checking times:** As in none of the reachable states the sender reports a certain unsuccessful transmission while the receiver got the complete file, the probability of satisfying this property is 0 and model checking reduces to an invariance check.
    
    {: columns="2 1" }

    | N:  | MAX: | Time (s): |
    |-----|------|-----------|
    | 16  | 2    | 0.001     |
    | 16  | 3    | 0.001     |
    | 16  | 4    | 0.001     |
    | 16  | 5    | 0.001     |

    | 32  | 2    | 0.002     |
    | 32  | 3    | 0.002     |
    | 32  | 4    | 0.002     |
    | 32  | 5    | 0.002     |

    | 64  | 2    | 0.002     |
    | 64  | 3    | 0.002     |
    | 64  | 4    | 0.001     |
    | 64  | 5    | 0.002     |
    
    <a name="propB"></a>
    
-   **Property B of {% cite "DJJL01" %}:** "The probability the sender reports a certain successful transmission but the receiver did not get the complete file."
    
    **Model checking times:** As in none of the reachable states the sender reports a certain unsuccessful transmission while the receiver got the complete file, the probability of satisfying this property is 0 and model checking reduces to an invariance check.
    
    {: columns="2 1" }

    | N:  | MAX: | Time (s): |
    |-----|------|-----------|
    | 16  | 2    | 0.001     |
    | 16  | 3    | 0.002     |
    | 16  | 4    | 0.002     |
    | 16  | 5    | 0.001     |

    | 32  | 2    | 0.002     |
    | 32  | 3    | 0.002     |
    | 32  | 4    | 0.002     |
    | 32  | 5    | 0.002     |

    | 64  | 2    | 0.002     |
    | 64  | 3    | 0.002     |
    | 64  | 4    | 0.002     |
    | 64  | 5    | 0.002     |
    
    <a name="prop1"></a>
    
-   **Property 1 of {% cite "DJJL01" %}:** "The probability the sender does not report a successful transmission."
    
    **Model checking times:**
    
    | N:  | MAX: | Precomputation: |||| Main Algorithm: || Probability: |
    | ^^  | ^^   | Prob0           || Prob1     || Time (s):       | Iterations: | ^^           |
    | ^^  | ^^   | Time (s):       | Iterations: | Time (s): | Iterations: | ^^              | ^^          | ^^           |
    |-----|------|-----------------|-------------|-----------|-------------|-----------------|-------------|--------------|
    | 16  | 2    | 0.01            | 11          | 0.11      | 97          | 0.01            | 125         | 4.23E-4      |
    | 16  | 3    | 0.01            | 13          | 0.10      | 97          | 0.01            | 127         | 1.26E-5      |
    | 16  | 4    | 0.01            | 15          | 0.11      | 97          | 0.01            | 131         | 3.76E-7      |
    | 16  | 5    | 0.01            | 17          | 0.10      | 97          | 0.01            | 133         | 1.12E-8      |

    | 32  | 2    | 0.01            | 11          | 0.18      | 193         | 0.02            | 225         | 8.46E-4      |
    | 32  | 3    | 0.01            | 13          | 0.18      | 193         | 0.02            | 229         | 2.52E-5      |
    | 32  | 4    | 0.01            | 15          | 0.21      | 193         | 0.02            | 231         | 7.52E-7      |
    | 32  | 5    | 0.01            | 17          | 0.22      | 193         | 0.02            | 235         | 2.24E-8      |

    | 64  | 2    | 0.01            | 11          | 0.38      | 385         | 0.03            | 425         | 0.001692     |
    | 64  | 3    | 0.01            | 13          | 0.37      | 385         | 0.04            | 427         | 5.05E-5      |
    | 64  | 4    | 0.01            | 15          | 0.42      | 385         | 0.05            | 431         | 1.51E-6      |
    | 64  | 5    | 0.01            | 17          | 0.44      | 385         | 0.06            | 433         | 4.48E-8      |
    
    <a name="prop2"></a>
    
-   **Property 2 of {% cite "DJJL01" %}:**"The probability the sender reports an uncertainty on the success of the transmission."
    
    **Model checking times:**
    
    | N:  | MAX: | Precomputation: |||| Main Algorithm: || Probability: |
    | ^^  | ^^   | Prob0           || Prob1     || Time (s):       | Iterations: | ^^           |
    | ^^  | ^^   | Time (s):       | Iterations: | Time (s): | Iterations: | ^^              | ^^          | ^^           |
    |-----|------|-----------------|-------------|-----------|-------------|-----------------|-------------|--------------|
    | 16  | 2    | 0.10            | 100         | 0.01      | 9           | 0.01            | 127         | 2.64E-5      |
    | 16  | 3    | 0.10            | 102         | 0.01      | 11          | 0.01            | 131         | 7.89E-7      |
    | 16  | 4    | 0.08            | 104         | 0.01      | 13          | 0.01            | 135         | 2.35E-8      |
    | 16  | 5    | 0.08            | 106         | 0.01      | 15          | 0.01            | 137         | 7.00E-10     |

    | 32  | 2    | 0.15            | 296         | 0.01      | 9           | 0.01            | 229         | 2.64E-5      |
    | 32  | 3    | 0.15            | 198         | 0.02      | 11          | 0.01            | 233         | 7.89E-7      |
    | 32  | 4    | 0.17            | 200         | 0.01      | 13          | 0.02            | 237         | 2.35E-8      |
    | 32  | 5    | 0.19            | 202         | 0.02      | 15          | 0.02            | 239         | 7.00E-10     |

    | 64  | 2    | 0.32            | 388         | 0.01      | 9           | 0.03            | 431         | 2.64E-5      |
    | 64  | 3    | 0.35            | 390         | 0.01      | 11          | 0.04            | 435         | 7.89E-7      |
    | 64  | 4    | 0.37            | 392         | 0.01      | 13          | 0.05            | 437         | 2.35E-8      |
    | 64  | 5    | 0.37            | 394         | 0.01      | 15          | 0.06            | 441         | 7.00E-10     |
    
    <a name="prop3"></a>
    
-   **Property 3 of {% cite "DJJL01" %}:**"The probability the sender reports an unsuccessful transmission after more than 8 chunks have been sent successfully."
    
    **Model checking times:**
    
    58606264
    
    | N:  | MAX: | Precomputation: |||| Main Algorithm: || Probability: |
    | ^^  | ^^   | Prob1E          || Prob0A    || Time (s):       | Iterations: | ^^           |
    | ^^  | ^^   | Time (s):       | Iterations: | Time (s): | Iterations: | ^^              | ^^          | ^^           |
    |-----|------|-----------------|-------------|-----------|-------------|-----------------|-------------|--------------|
    | 16  | 2    | 0.05            | 58          | 0.07      | 43          | 0.01            | 119         | 1.85E-4      |
    | 16  | 3    | 0.05            | 60          | 0.07      | 43          | 0.01            | 123         | 5.52E-6      |
    | 16  | 4    | 0.05            | 62          | 0.07      | 43          | 0.01            | 125         | 1.65E-7      |
    | 16  | 5    | 0.05            | 64          | 0.07      | 43          | 0.01            | 129         | 4.90E-9      |

    | 32  | 2    | 0.05            | 58          | 0.16      | 139         | 0.01            | 219         | 6.08E-4      |
    | 32  | 3    | 0.06            | 60          | 0.15      | 139         | 0.01            | 223         | 1.81E-5      |
    | 32  | 4    | 0.05            | 62          | 0.18      | 139         | 0.02            | 225         | 5.41E-7      |
    | 32  | 5    | 0.05            | 64          | 0.20      | 139         | 0.02            | 229         | 1.61E-8      |

    | 64  | 2    | 0.07            |             | 0.38      | 331         | 0.03            | 419         | 0.001454     |
    | 64  | 3    | 0.05            |             | 0.42      | 331         | 0.04            | 421         | 4.34E-5      |
    | 64  | 4    | 0.06            |             | 0.42      | 331         | 0.05            | 425         | 1.29E-6      |
    | 64  | 5    | 0.06            |             | 0.43      | 331         | 0.06            | 427         | 3.85E-8      |
    
    <a name="prop4"></a>
    
-   **Property 4 of {% cite "DJJL01" %}:** "The probability the receiver does not receive any chunk and the sender tried to send a chunk."
    
    **Model checking times:**
    
    | N:  | MAX: | Precomputation: |||| Main Algorithm: || Probability: |
    | ^^  | ^^   | Prob1E          || Prob0A    || Time (s):       | Iterations: | ^^           |
    | ^^  | ^^   | Time (s):       | Iterations: | Time (s): | Iterations: | ^^              | ^^          | ^^           |
    |-----|------|-----------------|-------------|-----------|-------------|-----------------|-------------|--------------|
    | 16  | 2    | 0.01            | 9           | 0.01      | 3           | 0.01            | 7           | 8.00E-6      |
    | 16  | 3    | 0.01            | 11          | 0.01      | 3           | 0.01            | 9           | 1.60E-7      |
    | 16  | 4    | 0.01            | 13          | 0.01      | 3           | 0.01            | 11          | 3.20E-9      |
    | 16  | 5    | 0.01            | 15          | 0.01      | 3           | 0.01            | 13          | 6.40E-11     |

    | 32  | 2    | 0.01            | 9           | 0.01      | 3           | 0.01            | 7           | 8.00E-6      |
    | 32  | 3    | 0.01            | 11          | 0.01      | 3           | 0.01            | 9           | 1.60E-7      |
    | 32  | 4    | 0.01            | 13          | 0.01      | 3           | 0.01            | 11          | 3.20E-9      |
    | 32  | 5    | 0.01            | 15          | 0.01      | 3           | 0.01            | 13          | 6.40E-11     |

    | 64  | 2    | 0.01            | 9           | 0.01      | 3           | 0.01            | 7           | 8.00E-6      |
    | 64  | 3    | 0.01            | 11          | 0.01      | 3           | 0.01            | 9           | 1.60E-7      |
    | 64  | 4    | 0.01            | 13          | 0.01      | 3           | 0.01            | 11          | 3.20E-9      |
    | 64  | 5    | 0.01            | 15          | 0.01      | 3           | 0.01            | 13          | 6.40E-11     |
