# FA + MRU Cache Simulation
[Simulation](https://kaninrice.github.io/FA-MRU-simulation/)

## Specifications
- 16 Cache blocks
- 32 words per cache line
- Load-through read policy

## Analysis of test cases

# a. Sequential sequence

Starting with a clear cache memory, the CPU freely loads through memory blocks 0 to n - 1, where n is the number of cache blocks.  The MRU algorithm then replaces the most recently used block, in this case, cache block n - 1, as it misses, until the sequence reaches its end. 

The start of the second pass hits on read from 0 to n - 2, since it was never replaced. Cache block n - 2 becomes the most recently used and the second victim, continually replaced as the sequence is read. This continues until it hits the last block of the sequence, the memory block last replaced with in the first pass. This forms the other end of the sequence along with the other passes to follow.

The third and fourth pass follows, successfully reading from 0 to n - 3 and 0 to n - 4, respectively. Their most recently used block is sequentially replaced until they hit the memory block on their victim + 1.

## Walkthrough
[Link]()
