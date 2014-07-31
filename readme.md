Purpose
-------

Objectives
* Portable (Linux, Mac, Windows, Android)
* Secure
* No online storage or transmission

The most reliable way to make something behave the same way on a variety of platforms, is to run it in a browser. With the Gibberish-AES library (https://github.com/mdp/gibberish-aes) the data can be encrypted securly. There is a little bit of hackery to allow the file to be saved and loaded, but it has worked on every system I've tested it on so far.

How to use
----------
I store my passwords on a thumbdrive I keep on my keychain. I keep a local copy of both the encrypted data file (vault.txt) and the application (vault.html) on all the computers I use regularly - making the data both accesible and backed up.

Source and Optimised
--------------------
I had some fun trying to make the file as small as possible. By combining the JavaScript, CSS and HTML into single file and compressing it, the applicaiton is easier to deploy and takes up a neglegible amount of space by almost any definition.

Key Pair
--------
The key pairs produced by this application are not public key pairs but more of a two-man-rule. The idea is that a user can give the two halves to two people they trust. In the event that some data is the vault is needed but the vault owner cannot retrieve it, the two key holders can unlock the vault if they both agree the circumstances justify it. Though not explicitly supported, a good use of this is to generate two key pairs distributed among three people. If we have keys A1, A2, B1 and B2 so that A1 and A2 can unlock the vault and so can B1 and B2 (but not B1 and A1 or B2 and A1), we distribute the keys like this:

Person 1: A1
Person 2: A2, B1
Person 3: A2, B2

Not to be morbid, but the practical use for this is to leave a way for friends and family to access your passwords if you become incapacitated or die. It is a good idea to have three key holders if one of the key holders is someone you live with due to the risk that both of you could be effected at the same time.

Keys must be entered with the commas.

Todo
----
* After selecting a site, automatically highlight password
* add generate password button
* move "locked" to top of file
* [optional] multi-key entry
* Remove json2 library