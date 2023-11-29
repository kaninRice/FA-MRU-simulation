# FA + MRU Cache Simulation
[Simulation](https://kaninrice.github.io/FA-MRU-simulation/)

## Specifications
- 16 Cache blocks
- 32 words per cache line
- Load-through read policy

## Analysis of test cases

**Test Case Analysis**



1. **Setup**

    The test cases were executed using different user inputs (main memory block count). This was done so that the performance of the simulation project could be measured equally among the different test cases. Specifically, the three test cases will be tested where:

- #of Memory Blocks = 1
- #of Memory Blocks = 16
- #of Memory Blocks = 32

    16 was chosen because it is equal to the cache size, while 32 was chosen because it serves as the limit specified in the specifications _[2n, where n = 16 (cache size)]. _A memory block count of 1 will also be measured because it is the only scenario where definite values for the random sequence can be determined. To be able to compare the random sequence with the other sequences, the performance of the other sequences when the number of main memory blocks is 1, will also be measured.
      Besides the number of memory blocks, another constant value among all three, will be the manner in which the average memory access time, and total memory access time will be calculated. The formula for average memory access time, which refers to the average time it takes to perform a cache memory operation, can be denoted as:


    _T<sub>AVG </sub>= hC + (1 - h) * M_


    Where:

* h = Hit rate
* C = Cache access time
* 1 - h = Miss rate
* M = Miss penalty

    _*Note that for this simulation project, the cache access time is 1ns, while the miss  penalty is 321ns._


    The total memory access time is defined as the total time it takes for all necessary memory operations to be executed. It is defined as:


    _T<sub>TOTAL </sub>= h(#of words * C) + (1-h)(# of words * M)_


    Where:

* h = Hit rate
* C = Cache access time
* # of words = 32
* 1 - h = Miss rate
* M = Miss penalty

    _*Note that for this simulation project, the # of words is specified in the specifications to be set to 32 words, the miss penalty is similar to that used to calculate the average memory access time._

2. **Sequential Sequence**

    **_Memory Access Count_**


    	When the number of main memory blocks is less than 32, the memory access count will always be equal to the number of main memory blocks, multiplied by 4. This is because as per the specifications, sequences up to the length of 2n [where n = 16 (cache size)] will be repeated four times. Main memory blocks with a count of 1 - 31 are still within this bound, thus this rule still applies.


    	When the number of memory blocks inputted is greater than or equal to 32, the memory access count will always be equal to 128. This is because based on the specifications, the maximum allowable length of the sequence is only equal to 2n (32), so once this is reached, regardless of the number of main memory blocks, the memory access count will always be equal to 4 * 2n, or 128.


    **_Cache Hit and Miss Count_**


    _	_When the number of main memory blocks is less than or equal to 16, the ratio of the cache hit count to the cache miss count will always be 3 : 1. This is because, during the first pass, cache blocks 0 to m, are filled with main memory blocks 0 to m, where m is some amount of main memory blocks less than or equal to 16, minus one. As a result, this will result in a miss count of m at the end of the first pass. For the second to fourth pass, all m blocks will be in the cache, leading to a hit count of 3m.


    	Once the number of main memory blocks exceeds 16, the hit count remains at 48 (3 x 16), while the miss count gradually increases as the number of main memory blocks increases, eventually stopping when the number of main memory blocks reaches 32, where it will remain at a miss count of 80, while the hit count remains at a value of 48. This hit and miss count will also hold true for any number of main memory blocks exceeding 32.


    	


    	


    **_Cache Hit and Miss Rate_**


    _	_Because the cache hit and miss rate is based on the cache hit and miss count,  as well as the memory access count, the cache hit and miss rate exhibits a similar behavior to that of the cache hit and miss count. As a result, when the number of main memory blocks is less than or equal to 16, the cache hit rate and cache miss rate is 0.75 (75%) and 0.25 (25%) respectively. As the number of memory blocks exceeds 16, the cache hit rate slowly decreases, while the cache miss rate increases. Once the number of memory blocks inputted by the user is equal to a value greater than or equal to 32, the final cache hit rate and cache miss rate is 0.375 (37.5%) and 0.625 (62.5%) respectively.


    **_Average Memory Access Time_**


    _	_For the average memory access time, when the number of main memory blocks is less than or equal to 16, the average memory access time is always equal to 81ns. This is because when the number of main memory blocks is less than or equal to 16, the cache hit rate, and cache miss rate is always equal to 0.75 (75%) and 0.25 (25%) respectively, leading to the constant value of 81ns. However, when exceeding 16 main memory blocks, the average memory access time slowly increases, due to the steady increase in the cache miss rate. Eventually, capping out at 201ns when the number of main memory blocks is equal to, or greater than 32.


    **_Total Memory Access Time_**


    _	_For the total memory access time, a normal behavior was observed. Where the larger the number of main memory blocks, the larger the total memory access time. This is mainly due to the main memory block amount influencing the memory access count, which in turn, influences the cache hit and miss counts, which influence the total memory access time, as per the formula stated above. It caps out however at 27216ns, which is the total memory access time should the user input a main memory block count of 32 and above.

3. **Random Sequence**

    **_Memory Access Count_**


    **_	_**For the memory access count for random sequences, regardless of the user’s input, the memory access count will always be equal to 64. This is because of the specifications which state that the sequence to run for the random sequence must always have a length of 4n, where n is equal to 16, which corresponds to the cache size.


    **_Cache Hit and Miss Count_**


    For the random sequence test case, the hit and miss count will always be random. This will only be false if the number of main memory blocks is set to 1. In this scenario, the cache hit count will be equal to 63, while the miss count will be equal to 1. This is because, having 1 memory block (block 0), will create a sequence of length 64 consisting only of block 0, meaning that the block will be accessed and mapped 64 times. For the first pass, it will be a miss, it will then be mapped, then for the succeeding 63 passes, since it is already in the cache memory, it will always be a hit.


    **_Cache Hit and Miss Rate_**


    **_	_**Similar to the cache hit and miss count, the hit and miss rate will mostly be random for the most part, except for when the number of main memory blocks is equal to 1. In this scenario, the hit rate will always be equal to 63/64, while the miss rate will be equal to 1/64.


    **_Average Memory Access Time_**


    **_	_**Similar to the previous variables measured, the average memory access time will always be random, except for when the main memory block count is equal to 1, in this scenario it will be 6ns.


    **_Total Memory Access Time_**


    _	_For the total memory access time, a main memory block count of 1 will yield a total access time of 2337ns. The reason for it being constant is that when the number of main memory blocks is equal to 1, the cache hit count and miss count remain constant. In the event that the number of main memory blocks is larger than 1 however, the result will be random.

4. **Mid-Repeat Sequence**

    **_Memory Access Count_**


    _	_For the mid-repeat sequence, when the input is less than or equal to 14, the sequence which is repeated four times is the sequence 0 -( # of main memory blocks - 1) + (# of main memory blocks - 1). So for example, in the event where the input is equal to 13, the memory access could be found by getting the number of blocks in the sequence 0 - 12, then getting the number of blocks in the sequence, 1 - 12, then multiplying the sum of the two lengths by four. So in this case, it would be [13 + 12] * 4, so an input of 13, would lead to a memory access count of 100, this is followed by values less than 14. For inputs greater than 14, the first sequence consists of 0 to 14, the length of which is added to the sequence 1 to (# of memory blocks - 1), and is then multiplied by 4. Let us consider the example, where the input is equal to 32, the first half of the first pass, is the sequence 0 to 14, while the second half of the sequence is 1 to 31, getting the lengths of these sequences yields: [15 + 31] = 46, then we multiply by 4. Yielding a memory access count of 184. The case of an input of 32 holds true for all other instances where the input is greater than 32.


    **_Cache Hit and Miss Count_**


    _	_In the case of the mid-repeat sequence test case, when the input is less than the cache size (16), the cache hit and miss count ratio varied unlike in the case of the sequential sequence. This is due to the fact that the memory access count changes more in the mid-repeat test as compared to the sequential test. One interesting observation was that the hit rate was significantly higher than the miss rate. This is because of the way the sequence is generated. Initially, the miss count is equal to the user input (number of main memory blocks), these misses occur during the first pass when the sequence is passed for the first time. Since the second sequence is the first sequence where the start is shifted forwards by 1 (from start at block 0 to start at block 1), the end is shifted forwards by 1 as well (from ending at block m to ending at block m + 1).


    	When the input exceeds that of the cache size, the miss count increases by a noticeable amount, mainly due to the overwriting of cache data being done very frequently. One observation regarding this is that in the mid-repeat test case, rewriting of data occurred more than during the sequential sequence test case, given the same input. Once the input is greater than or equal to 32, the cache miss count caps at 83. The reason for the limitation of 32, is due to the specifications which states that sequences cannot reach a length beyond 2n (where n is the cache size; 16).


    **_Cache Hit and Miss Rate_**


    **_	_**The cache hit and miss rate follows a similar pattern to that of the cache hit and miss count, where in the event where the input is less than the cache size, the miss rate is equal to input size / memory access count, while the hit rate is equal to (memory access count - miss count) / memory access count.


    	When the input exceeds the cache size, the miss rate gets gradually higher and higher while the hit rate shrinks continuously. This is because of the relationship between the cache hit and miss count as the input increases, where the miss count gets larger and larger. Eventually, when the input is greater than or equal to 32, the cache hit rate and miss rate is equal to 101/184 and 83/184 respectively. It should be noted that in all valid instances, the hit count never becomes lower than the miss count. This is due to the structure of the sequence where cache hits become a lot more common than cache misses, regardless of how the input grows.


    **_Average Memory Access Time_**


    **_	_**For average memory access time, as the number of inputs increases, the average memory access time increases gradually. This caps out when the number of inputs is equal to 32, where the average memory access time caps out at ~145.34ns. This is true regardless of the input because of the fact that as the input increases, the hit rate and miss rate gradually changes.


    **_Total Memory Access Time_**


    _	_Similar to the average memory access time, there is a direct relationship between the growth of the input, and the growth of the total memory access time. This is because, as the number of inputs grows, the memory access count grows, which affects the hit and miss count, which affects the total memory access time.

5. **Comparison of Test Cases**

    	For the comparison of the performance of the three different test cases, we will only consider the edge case, where the number of main memory blocks inputted by the user, is equal to 32 (2n, where n = 16 - cache size). This is because this was the boundary followed by both the sequential and mid-repeat sequence test cases. To compare the random sequence test case with the other two test cases, we will also look at an edge case, where the user inputted number of main memory blocks is equal to 1. This is because when the user input is at this value, the random sequence generates a definite value.


    **_Memory Access Count_**


    When the user input was set to 1, both the sequential sequence and the mid-repeat sequence had a memory access count of 4, while the random sequence had a memory access count of 64, it is 64 because that is the constraint set on it where it can only be equal to 64. When the user input is set to 32, the random sequence still has a memory access count of 64, while the mid-repeat sequence has a memory access count of 184. The sequential sequence had the smallest memory access count at 128.


    **_Cache Hit and Miss Count_**


    **_	_**When the user input is set to 1, the sequential sequence has a cache hit and cache miss ratio of 3 : 1, which was also the case with the mid-repeat sequence. The random sequence had a cache hit - cache miss ratio of 63 : 1. When the user input is set to 32, the sequential sequence had a cache hit - cache miss ratio of 48 : 80, while the mid-repeat sequence had a cache hit - cache miss ratio of 101 : 83. In this case, the random sequence is not mentioned because it yielded a random ratio each time the program was executed.


    **_Cache Hit and Miss Rate_**


    **_	_**The cache hit and miss rate behaves similarly to the cache hit and miss count. When the user input is set to 1, the sequential sequence has a cache hit and miss ratio of 0.75 (75%) and 0.25 (25%) respectively, which is also the case for the mid-repeat sequence. For the random sequence, the cache hit and cache miss ratio is 63/64 : 1 / 64. When the input is equal to 32, the sequential sequence has a cache hit rate of 0.375 (37.5%), and a cache miss rate of 0.625 (62.5%)., while the mid-repeat sequence has a cache hit rate of ~54.8% while the cache miss rate is ~45.1%.


    **_Average Memory Access Time_**


    **_	_**When the user input is equal to 1, the average memory access time when performing the sequential sequence test is 81ns, same with the mid-repeat sequence. The random sequence has an average access time of 6ns in this scenario. When the user input is 32, the sequential sequence has an average access time of 201ns compared to the mid-repeat sequence’s time of ~145.34ns, the random sequence has a random average memory access time depending on the sequence, so as a result, will be disregarded.


    **_Total Memory Access Time_**


    **_	_**When the user input is equal to 1, the sequential sequence has a total memory access time of 417ns, which is the same as that of the mid-repeat sequence. For the random sequence, a total memory access time of 2337ns was obtained. When the input was set as 32, the total memory access time of the sequential sequence was 27216ns, while for the mid-repeat sequence, it was 29875ns. For the random sequence, it was again, dependent on the instance generated, which is why it will be disregarded.


    **_Conclusion_**


    _	_These tests produced varying results in terms of memory access count, cache hit and miss count, cache hit and miss rate, and average and total access time. Overall, sequential sequence and mid-repeat sequence produced the most desirable results in terms of different outputs. Unsurprisingly, the random sequence generated a volatile result, capable of producing either the highest or lowest values. In terms of the metrics mentioned above, the project was able to process the sequential sequence better than the mid-repeat sequence in terms of memory access count, and total memory access time, while the mid repeat-sequence was better in terms of average memory access time, and cache hit and miss rate. Based on this data, we can conclude that for both instances, the project performed well, and can be implemented for both scenarios, where whether it is implemented for sequential sequences, or for mid-repeat sequences will depend on what metric you want your product to excel in.



## Walkthrough
[Link]()
