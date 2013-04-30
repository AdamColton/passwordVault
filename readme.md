== Purpose ==

Objectives
* Portable (Linux, Mac, Windows, Android)
* Secure
* No online storage or transmission

The most reliable way to make something behave the same way on a variety of platforms, is to run it in a browser. With the Gibberish-AES library (https://github.com/mdp/gibberish-aes) the data can be encrypted securly. There is a little bit of hackery to allow the file to be saved and loaded, but it has worked on every system I've tested it on so far.

== How to use ==
I store my passwords on a thumbdrive I keep on my keychain. I keep a local copy of both the encrypted data file (vault.txt) and the application (vault.html) on all the computers I use regularly - making the data both accesible and backed up.

== Source and Optimised ==
I had some fun trying to make the file as small as possible. By combining the JavaScript, CSS and HTML into single file and compressing it, the applicaiton is easier to deploy and takes up a neglegible amount of space by almost any definition.