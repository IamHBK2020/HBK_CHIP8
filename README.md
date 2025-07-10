# CHIP-8
An emulator written in javascript.
[Chip-8](https://en.wikipedia.org/wiki/CHIP-8) is an interpreted programming language from the 1970s. It ran on the COSMAC VIP, and supported
many programs such as Pac-Man, Pong, Space Invaders, and Tetris.
### [VIEW THE DEMO](https://iamhbk2020.github.io/HBK_CHIP8/)
Also you can download extra roms from the repo and add them to the game.
Although the feature could have been improved.

## Controls
Chip 8 games use a hex keyboard
ranging from 1-4 at the top
to Z-V at the bottom

```bash
1 2 3 4
Q W E R
A S D F
Z X C V
```
### Space Invader controls:
```bash
W start and shoot
Q and E to move left and right
```

## Installation
Clone the repository via
```bash
git clone https://github.com/IamHBK2020/HBK_CHIP8.git
```


## What Technology Are Using In This Project
- Vanilla Javascript
- HTML , CSS 


## Motivation
Chip8.js is a project to write a Chip-8 emulator in JavaScript. The main motivation is to learn lower level programming concepts and to increase familiarity with the Javascript environment.

Here are some of the concepts I learned while writing this program:

- The base system: specifically base 2 (binary), base 10 (decimal), base 16 (hexadecimal), how they interact with each other and the concept of abstract numbers in programming
- Bits, nibbles, bytes, ASCII encoding, and big and little endian values
- Bitwise operators - AND (&), OR (|), XOR (^), left shift (<<), right shift (>>) and how to use them for masking, setting, and testing values
- Using the Javascript built-in file system (fs)
- The concept of a raw data buffer and how to work with it, how to convert an 8-bit buffer to a 16-bit big endian array
- How a CPU can utilize memory, stack, program counters, stack pointers, memory addresses, and registers
- How a CPU implements fetch, decode, and execute

## Acknowledgements
- Inspired from TaniaRascia's version and Alex Dickson's JSConf.Asia 2013
- Cowgod's Chip-8 Technical Reference, made by Thomas P. Greene.
- Big thanks to Eric Grandt
- CHIP-8 - Wikipedia.
   
## Project Screenshot
