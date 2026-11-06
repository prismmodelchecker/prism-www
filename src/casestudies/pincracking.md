---
layout: layouts/base.njk
title: "PIN Cracking Schemes"
section: casestudies
permalink: /casestudies/pincracking/
---
# PIN Cracking Schemes

*[Contributed by Graham Steel]*{.note}

## Contents

-   [Introduction](#intro)
-   [PIN Blocks](#pinblocks)
-   [A Reformatting Attack](#attack)
-   [AnaBlock](#anablock)
-   [About the Project](#project)

**Related publications**: {% cite "Ste06" %} and [this WIRED article](http://blog.wired.com/27bstroke6/2009/04/pins.html)

## Introduction { #intro }

Suppose you bank in the UK, and you put your bank card into an ATM in Germany to withdraw some money. You type in your PIN, which has to be sent to the UK for your bank to authorise. The PIN is encrypted to prevent criminals from obtaining it. However, the ATM you use will not know the correct key for sending the PIN directly to your home bank. Instead, the encrypted PIN will pass through several nodes in the ATM network before it gets to the issuing bank. At each node, the PIN will be decrypted and re-encrypted under the appropriate key to be sent to the next node.

![ATM Network](/images/cs/pincracking.scenario.jpg)

*ATM Network*{.caption}

It is considered an unacceptable security risk for the PIN to appear in 'plaintext' form in the memory of a normal PC in a bank. So, all PIN decryption, re-encryption and verification is carried out inside tamper-proof hardware security modules (HSMs) like the one shown below. Note the tamper-proof, shielded enclosure, inside which all the processing occurs. Inside the enclosure is a CPU, a dedicated cryptoprocessor for standard encryption algorithms, and a small amount of memory. Should an intruder open the casing, or insert probes, to try to read the memory, it will auto-erase in a matter of nanoseconds.

![IBM 4758 HSM](/images/cs/pincracking.hsm.jpg)

*IBM 4758 HSM - photo courtesy Mike Bond*{.caption}

The goal of these HSMs, with their strictly controlled APIs, is to prevent corrupt insiders in a bank from being able to obtain customers' PIN values. However, recent research has uncovered several ways in which this can be achieved [<a href="#ref-Clu03">Clu03</a>].

## PIN Blocks { #pinblocks }

In order for a PIN to be encrypted by the standard encryption algorithms such as 3DES, it must be made into a 64-bit 'PIN block'. To complicate matters somewhat, different banks expect the PIN to be formatted into a PIN block in different ways. For example, for a 4-digit PIN, the VISA-3 format looks like this:

<p style="border:2px #cccccc solid; padding:5px;">P<sub>1</sub> P<sub>2</sub> P<sub>3</sub> P<sub>4</sub> F F F F F F F F F F F F</p>

Each character represents a 4-bit nybble. The P<sub>i</sub>s are the PIN digits, and the Fs are F hexadecimal. A problem with this format is that if two people have the same PINs, they will look the same when they are encrypted under the same key. To prevent this, the ISO proposed the ISO-0 format in ISO standard 9564:

<p style="border:2px #cccccc solid; padding:5px;">B<sub>1</sub> = 0 4 P<sub>1</sub> P<sub>2</sub> P<sub>3</sub> P<sub>4</sub> F F F F F F F F F F<br>B<sub>2</sub> = 0 0 0 0 A<sub>1</sub> A<sub>2</sub> A<sub>3</sub> A<sub>4</sub> A<sub>5</sub> A<sub>6</sub> A<sub>7</sub> A<sub>8</sub> A<sub>9</sub> A<sub>10</sub> A<sub>11</sub> A<sub>12</sub><br>PIN Block = B<sub>1</sub> XOR B<sub>2</sub></p>

The 0 at the beginning of B<sub>1</sub> marks the block as being in format 0. The 4 indicates the length of the PIN, in this case 4 digits. The A<sub>i</sub>s in B<sub>2</sub> are the 12 digits of the customer's personal account number (PAN). This way, two customers with the same PIN will not have the same encrypted block.

## A Reformatting Attack { #attack }

The API of the HSM may include a 'translate' command to allow blocks to reformatted ready to be sent to the next node. This introduces an attack. The problem is that in order to translate from ISO format to VISA-3 format, the user must re-supply the PAN so it can be XORed away to reveal B<sub>1</sub>. At this point, the HSM performs an error check, to see if all the PIN digits are of decimal value. Suppose that instead of supplying the correct PAN, the attacker supplies a modified PAN. This modification could be to XOR in the value 8 against the first digit, producing A<sub>1</sub>' = A<sub>1</sub> XOR 8. If P<sub>3</sub> is 0, 1, 8 or 9, the error check will still pass, since these values XOR 8 all give a decimal value. However, if the PIN digit is in the range 2-7, the HSM will signal an error, since these values all XOR against 8 to give a value between A and F hexadecimal.

By repeating this process with various values, an attacker can narrow down the value of the third PIN digit. He can only narrow it down to a pair of possible values though, since each pair of digits, 0 and 1, 2 and 3, etc., will give an identical pattern of errors and passes when XORed against values chosen by the attacker. However, by masquerading the ISO block as a VISA-3 block, the attacker can shift the PIN digits to the right, and extend the attack to determine the PIN digits uniquely.

### AnaBlock { #anablock }

There are several known families of PIN recovery attacks like the reformatting attack. Each customer for an HSM manufacturer will configure their HSMs differently, enabling different PIN block formats and different commands from the API. We have created a system, AnaBlock, which takes such a configuration and determines the most effective PIN block attack available to the intruder. It does this by using constraint logic programming in SICStus Prolog to build a large tree of all possible moves the intruder can make. Each node in the tree represents a state, where the attacker knows the PIN is in a certain range. For one particular attack, the edges in the tree will represent probabilistic choices, e.g. where the attacker tries a command, and the HSM may or may not report an error, depending on the actual (unknown) value of the PIN. The probabilities of each outcome depend only on properties of the state we are in, i.e. our attacks are represented by Markov chains (MCs). For a family of attacks, the tree will contain both probabilistic choices and non-deterministic choices, where the attacker chooses what he will try next. A family of attacks is thus represented by a Markov decision process (MDP). The idea is to analyse security in two stages: first, to generate using constraint logic programming an MDP representing all possible attacks, and then to use PRISM to analyse the MDP and choose the MC representing the most effective attack (we used a prototype version of PRISM which includes the facility to extract the MC satisfying the specified property). This is either the attack that determines the PIN in the lowest number of steps, or in situations where no such attack exists, the attack that reduces the PIN to the smallest number of possible values. Full details of the operation of AnaBlock will appear in a forthcoming paper {% cite "Ste06" %}.

Below can be found an example fragment of a tree produced by AnaBlock and the code for the PRISM model which was used to generate it.

![A fragment of a tree produced by AnaBlock](/images/cs/pincracking.tree.jpg)

*A fragment of a tree produced by AnaBlock*{.caption}

{% prismCode "casestudies/examples/pincracking.nm", false, true %}

## About the Project { #project }

This work is part of the ongoing project 'Automated Analysis of Security Critical Systems', funded by EPSRC (grant number GR/S98139/01), with nCipher plc., a manufacturer of cryptographic hardware security modules, and CESG, the information assurance arm of GCHQ. For more details, see [http://dream.dai.ed.ac.uk/projects/aascs](http://dream.dai.ed.ac.uk/projects/aascs).

## References

-   <a id="ref-Clu03"></a>[Clu03] J. Clulow. *The Design and Analysis of Cryptographic APIs for Security Devices*. MSc thesis, University of Natal, 2003.
