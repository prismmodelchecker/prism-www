---
layout: layouts/base.njk
title: "Language Changes"
section: downloads
permalink: /language-changes/
---
# PRISM Language Changes

As a consequence of the new and improved language parser in new versions of PRISM, there are a few changes to the PRISM modelling language which may break your existing models. In particular:

-   Updates in commands must be parenthesised, e.g. this is allowed:
    
    ```
    [] s=1 & x>0 -> (s'=2) & (x'=x+1);
    ```
    
    but this is not:
    
    ```
    [] s=1 & x>0 -> s'=2 & x'=x+1;
    ```
    
    The former has always been the correct syntax but the parser was previously more lenient.

-   Ranges (e.g. `x=1..3,5`) are unfortunately no longer supported. These must now be specified explicitly, e.g.:
    
    ```
    (x>=1&x<=3)|x=5
    ```
    
    At a later date, we may introduce a function or construct to replace this functionality.

**Why have these changed been made?**

The old PRISM language parser had several flaws, including a grammar that was ambiguous in places. In order to develop a new parser, with greater efficiency and much improved error handling, we had to remove these ambiguities, resulting in the changes above.

**Is there a quick way of converting my old model files?**

Yes - on Linux/Mac/etc. use the script in `etc/scripts/prism3to4`. Usage is:

-   `etc/scripts/prism3to4 old_model.pm new_model.pm`

or just:

-   `etc/scripts/prism3to4 model.pm model.pm`

**Other questions or problems?**

Please post a message in the [discussion group](http://groups.google.com/group/prismmodelchecker).
