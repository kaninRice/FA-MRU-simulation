/* Input Sidebar */
const sequenceBtn = document.querySelector('.sequence-button');
const randomBtn = document.querySelector('.random-button');
const midrepeatBtn = document.querySelector('.midrepeat-button');
const totalMemBlocks = document.querySelector('#num-mem-blocks');
const sequenceInputList = document.querySelector('.sequence-input');
const submitBtn = document.querySelector('.submit-button');
const stepBtn = document.querySelector('.step-button');
const finalBtn = document.querySelector('.final-button');
const resetBtn = document.querySelector('.reset-button');

/* Cache Section */
const cacheBlockList = document.querySelector('.cache-block-list');

/*  Output Sidebar */
const memoryAccessCount = document.querySelector('.access-count');
const cacheHitCount = document.querySelector('.hit-count');
const cacheMissCount = document.querySelector('.miss-count');
const cacheHitRate = document.querySelector('.hit-rate');
const cacheMissRate = document.querySelector('.miss-rate');
const aveMemoryAccessTime = document.querySelector('.ave-access-time');
const totMemoryAccessTime = document.querySelector('.total-access-time');
const textLog = document.querySelector('#text-log');

const CACHE_BLOCK_NUM = 16;
let TOTAL_MEM_BLOCKS = totalMemBlocks.value;
const TEXT_LOG = [
    '00: ',
    '01: ',
    '02: ',
    '03: ',
    '04: ',
    '05: ',
    '06: ',
    '07: ',
    '08: ',
    '09: ',
    '10: ',
    '11: ',
    '12: ',
    '13: ',
    '14: ',
    '15: ',
];

let inputArray = [];
let currInputIndex = -1;
let mruIndex = -1;
let hit = 0;
let miss = 0;
submitBtn.addEventListener('click', () => {
    //resetAll
    resetAll();
    TOTAL_MEM_BLOCKS = totalMemBlocks.value;
    console.log(TOTAL_MEM_BLOCKS);
    initializeSim();
});
initializeSim();
function initializeSim() {
    /* Sequence test case is default */

    //recall las sequence used when changing total memory blocks
    if(randomBtn.disabled == true){
        generateRandom();
        midrepeatBtn.disabled = false;
        randomBtn.disabled = true;
        sequenceBtn.disabled = false;
    }else if(midrepeatBtn.disabled == true){
        generateMidRepeat();
        midrepeatBtn.disabled = true;
        randomBtn.disabled = false;
        sequenceBtn.disabled = false;
    }else{
        generateSequence();
        midrepeatBtn.disabled = false;
        randomBtn.disabled = false;
        sequenceBtn.disabled = true;
    }

    updateSequenceInput();

    sequenceBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateSequence();
        updateSequenceInput();
        toggleStepFinal('enable');
        midrepeatBtn.disabled = false;
        randomBtn.disabled = false;
        sequenceBtn.disabled = true;
    });

    randomBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateRandom();
        updateSequenceInput();
        toggleStepFinal('enable');
        midrepeatBtn.disabled = false;
        randomBtn.disabled = true;
        sequenceBtn.disabled = false;
    });

    midrepeatBtn.addEventListener('click', () => {
        currInputIndex = -1;
        generateMidRepeat();
        updateSequenceInput();
        toggleStepFinal('enable');
        midrepeatBtn.disabled = true;
        randomBtn.disabled = false;
        sequenceBtn.disabled = false;
    });

    stepBtn.addEventListener('click', () => {
        currInputIndex++;
        let index = 0;
        index = stepFAMRU(inputArray[currInputIndex]);
        updateCacheBlock(index, inputArray[currInputIndex]);
        
        updateCacheHitCount(hit);
        updateCacheMissCount(miss);
        updateMemoryAccessCount(miss+hit);
        const hitRate = hit/(hit+miss);
        const missRate = miss/(hit+miss);
        updateCacheHitRate(hitRate);
        updateCacheMissRate(missRate);
        updateAveMemoryAccessTime(hitRate*1 + ((10+20)/2)* missRate);
        updateTotMemoryAccessTime(hit*2 + miss* (20+1)); 
        updateTextLog(index, inputArray[currInputIndex]);
        updateSequenceInputHighlight();
        if (currInputIndex == inputArray.length - 1) {
            toggleStepFinal('disable');
        }
    });

    finalBtn.addEventListener('click', () => {
        finalFAMRU();
        toggleStepFinal('disable');
    });

    resetBtn.addEventListener('click', () => {
        currInputIndex = -1;
        mruIndex = -1;
        hit = 0;
        miss = 0;
        resetOutput();
        resetCacheBlock();
        updateSequenceInputHighlight();
        toggleStepFinal('enable');
        
    });
}

/* Input Sidebar */
function generateSequence() {
    let tmp = [];
    const NUMBER_OF_REPETITION = 4;
    inputArray = [];

    for (let i = 0; i < TOTAL_MEM_BLOCKS * 2; i++) {
        tmp.push(i);
    }

    for (let i = 0; i < NUMBER_OF_REPETITION; i++) {
        inputArray = inputArray.concat(tmp);
    }
}

function generateRandom() {
    inputArray = [];

    for (let i = 0; i < TOTAL_MEM_BLOCKS * 4; i++) {
        inputArray.push(Math.floor(Math.random() * 100)); /* 0 - 99 */
    }
}

function generateMidRepeat() {
    let tmp = [];
    const NUMBER_OF_REPETITION = 4;
    inputArray = [];

    for (let i = 0; i < TOTAL_MEM_BLOCKS-1; i++) {
        tmp.push(i);
    }

    for (let i = 0; i < TOTAL_MEM_BLOCKS * 2; i++) {
        tmp.push(i);
    }

    for (let i = 0; i <NUMBER_OF_REPETITION; i++) {
        inputArray = inputArray.concat(tmp);
    }
}

function updateSequenceInput() {
    sequenceInputList.textContent = '';

    for (let i = 0; i < inputArray.length; i++) {
        sequenceInputList.innerHTML += `<li class="">${inputArray[i]}</li>`;
    }
}

function updateSequenceInputHighlight() {
    let sequenceInput = [...sequenceInputList.children];
    let prevInput = document.querySelector('.current-input');
    console.log(prevInput);
    if (prevInput != null) {
        prevInput.classList.remove('current-input');
    }

    if (currInputIndex >= 0) {
        sequenceInput[currInputIndex].classList.add('current-input');
    }
}

/* Cache Section */
function stepFAMRU(currInput) {
    /* TODO: */
    //check if  mm block  is stored in cache
    //if yes, then transfer mru to the  cache index containing the  mm block
    //else check if there is available space in cache,
    //if yes, then place the mm in the free space
    //else replace the existing mm block in the cache index containing mru
    let cacheBlocks = [...cacheBlockList.children];
    let isHit = false;
    let prevMRU = -1;
    for(let i = 0; i < CACHE_BLOCK_NUM; i++) {
        if(cacheBlocks[i].children[2].textContent == 'MRU') {
            prevMRU = i;
        }
        if(currInput == parseInt(cacheBlocks[i].children[1].textContent)) {
            mruIndex = i;
            hit+=1;
            console.log("hit = "+hit);
            return i;
        }
    }
    if(!isHit){

        miss+=1;
        if(miss > 16){
            return prevMRU; //not hit and cache is full
        }
    }
    return miss-1; //not hit and cache is not full
    
}

function finalFAMRU() {
    /* TODO: */
    //get the number of repititions of the stepFAMRU left
    //loop stepFAMRU for the number of repititions
    let total = inputArray.length - currInputIndex;
        for(i=0; i<total-1; i++){
            currInputIndex++;
            let index = 0;
            index = stepFAMRU(inputArray[currInputIndex]);
            updateCacheBlock(index, inputArray[currInputIndex]);
            
            updateCacheHitCount(hit);
            updateCacheMissCount(miss);
            updateMemoryAccessCount(miss+hit);
            const hitRate = hit/(hit+miss);
            const missRate = miss/(hit+miss);
            updateCacheHitRate(hitRate);
            updateCacheMissRate(missRate);
            updateAveMemoryAccessTime(hitRate*1 + ((10+20)/2)* missRate);
            updateTotMemoryAccessTime(hit*2 + miss* (20+1)); 
            updateTextLog(index, inputArray[currInputIndex]);
            updateSequenceInputHighlight();
        }
}

function resetCacheBlock() {
    for (let i = 0; i < CACHE_BLOCK_NUM; i++) {
        updateCacheBlock(i, null);
    }
}

function updateCacheBlock(cacheIndex, value) {
    let cacheBlocks = [...cacheBlockList.children];
    let prevMRU = document.querySelector('.mru');

    if (prevMRU != null) {
        prevMRU.classList.remove('mru');
        prevMRU.children[2].textContent = '';
    }

    if (cacheIndex >= 0 && value == null) {
        cacheBlocks[cacheIndex].children[1].textContent = '';
        cacheBlocks[cacheIndex].children[2].textContent = '';
    } else {
        cacheBlocks[cacheIndex].classList.add('mru');
        cacheBlocks[cacheIndex].children[1].textContent = `${value}`;
        cacheBlocks[cacheIndex].children[2].textContent = `MRU`;
    }
}

/* Output Sidebar */
function updateMemoryAccessCount(value) {
    memoryAccessCount.textContent = `${value}`;
}

function updateCacheHitCount(value) {
    cacheHitCount.textContent = `${value}`;
}

function updateCacheMissCount(value) {
    cacheMissCount.textContent = `${value}`;
}

function updateCacheHitRate(value) {
    cacheHitRate.textContent = `${value}`;
}

function updateCacheMissRate(value) {
    cacheMissRate.textContent = `${value}`;
}

function updateAveMemoryAccessTime(value) {
    aveMemoryAccessTime.textContent = `${value}`;
}

function updateTotMemoryAccessTime(value) {
    totMemoryAccessTime.textContent = `${value}`;
}

function updateTextLog(cacheIndex, value) {
    TEXT_LOG[cacheIndex] = TEXT_LOG[cacheIndex].concat(value, ', ');
    textLog.textContent = TEXT_LOG.join('\n');
}
function resetOutput() {
    updateMemoryAccessCount(0);
    updateCacheHitCount(0);
    updateCacheMissCount(0);
    updateCacheHitRate(0);
    updateCacheMissRate(0);
    updateAveMemoryAccessTime(0);
    updateTotMemoryAccessTime(0);
    for(let i = 0; i < TEXT_LOG.length; i++) {
        TEXT_LOG[i] = TEXT_LOG[i].substring(0, 4);
        textLog.textContent = TEXT_LOG.join('\n');
    }
}

/* Other */
function toggleStepFinal(option) {
    if (option === 'enable') {
        stepBtn.disabled = false;
        finalBtn.disabled = false;
    } else {
        stepBtn.disabled = true;
        finalBtn.disabled = true;
    }
}
function resetAll(){
    resetOutput();
    resetCacheBlock();
    currInputIndex = -1;
    mruIndex = -1;
    hit = 0;
    miss = 0;
    updateSequenceInputHighlight();
    toggleStepFinal('enable');
}


