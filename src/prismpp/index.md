---
layout: layouts/base.njk
title: "The PRISM Preprocessor"
section: downloads
permalink: /prismpp/
---
# The PRISM Preprocessor (<span style="color:red">beta</span>)

We have developed a simple preprocessor tool for PRISM files, which can be used to automate generation of PRISM model and properties files that contain a lot of repetition. Instructions for the preprocessor are embedded in a PRISM file and identified by placing them within a pair of hash symbols (`#...#`). Here is a simple example:

{% prismCode "prismpp/examples/pp_example1.nm.pp", false, true %}

The resulting PRISM model file (for N=4) is:

{% prismCode "prismpp/examples/pp_example1.nm", false, true %}

With the preprocessor, you can:

-   declare undefined constants, which will be given values when the file is processed
    -   e.g. `#const N#` above
-   create for loops which will result in the enclosed text being repeatedly generated
    -   e.g. `#for i=2:N# ... #end#` above
-   include arbitrary expressions using constants or for-loop variables which will be evaluated and output
    -   e.g. `#i#` above

Some other points:

-   Expressions (like `#i#` above, or in the lower/upper bounds of for loops) can use any operators allowed in the PRISM modelling language.
-   There are shorthand expressions for some common uses of for loops:
    -   e.g. `#+ i=1:3# x#i# #end#` which becomes `x1+x2+x3`
    -   as well as summation (`+`), you can do this with: multiplication (`*`), disjunction (`|`), conjunction (`&`), commas (`,`) and semicolons (`;`).
-   You can also create defined constants, in terms of undefined ones
    -   e.g. `#const N# #const K = floor(pow(2, N))-1#`
-   Note that preprocessor constant declarations are not outputted so if you want that constant to be available in the PRISM file too, then use two lines of the form:
    -   `#const N#`
    -   `const int N = #N#;`

## Examples

Here are some examples of preprocessor files:

-   [hermanN.pm.pp](/casestudies/examples/hermanN.pm.pp)
-   [rabinN.nm.pp](/casestudies/examples/rabinN.nm.pp)

## Running the preprocessor

The preprocessor is actually included in the PRISM tool; you just need a script to run it. Currently we only have a Linux version of the script, which is [here](/prismpp/prismpp). Save the file as `prismpp`, make it executable (`chmod 755 prismpp`), ensure that both `prism` (which is needed by the preprocessor) and `prismpp` are in your path. You can then run it as in the following example:

-   `prismpp pp_example1.nm.pp 4 > pp_example1.nm`

The output of the tool can be redirected to a file as shown. The values of constants (N=4 in this case) are included after the name of the input file, in the order in which they appear in the file. Constants for multiple constants are separated by spaces.

## Feedback

Please note that the PRISM preprocessor is an experimental tool. Bug reports, suggestions for additions/improvements, and any other comments are always welcome.
