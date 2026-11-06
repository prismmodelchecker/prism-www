---
layout: layouts/base.njk
title: "Resources"
section: downloads
permalink: /resources/
---
# Resources

Several smaller pieces of code are provided to facilitate the use of PRISM. These files reside in the `etc/` directory of PRISM.

## Syntax Highlighting

The directory `etc/syntax-highlighters` of the prism source contains syntax-highlighting scripts for text editors GEdit, NEdit, TextWrangler and Vim. The installation instructions are given at the beginning of each of the scripts, or in case of Vim they are in the file `NOTES`.

## Programmable Completion for Bash

The file `etc/scripts/bash_prism_completion.sh` contains a bash function that activates completion of PRISM parameters for Bash. If installed, it is possible to get a list of available command line switches upon typing `-` and hiting &lt;TAB> twice, to get a list of methods for switches such as `-ptamethod`, or list of constants contained in the model file to be checked.

For the installation instructions, refer to the beginning of the file `etc/scripts/bash_prism_completion.sh`.

## Icons

Icons of various sizes are included in the directory `/etc/icons`.

## Conversion Scripts for HTML and LaTex

The scripts `etc/scripts/prism2html` and `etc/scripts/prism2latex` convert PRISM models/properties to HTML and LaTex, respectively. The generated files are then used together with the files `etc/prism.css` and `etc/prism.tex`, respectively, to highlight the code.
