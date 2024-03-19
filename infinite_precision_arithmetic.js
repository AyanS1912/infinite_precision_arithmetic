// InfiniteNumberArithmatic.js

/**
 * Class representing infinite precision arithmetic.
 */
class InfiniteNumberArithmetic {

    /**
     * An internal member Array to contain the digits of the Infinite Integer.
     * @private
     * @type {Array<number>}
     */
    _internalArray = [];

    /**
     * Constructor for InfiniteNumberArithmatic class.
     * @param {number|string|Array<number>|InfiniteNumberArithmetic} inputObject 
     */
    constructor(inputObject) {
        if (typeof inputObject === "number") {
            // Handle number input
            this.initializeFromArray(this.convertNumberToArray(inputObject));
        } else if (typeof inputObject === "string") {
            // Handle string input
            this.initializeFromArray(this.convertStringToArray(inputObject));
        } else if (Array.isArray(inputObject)) {
            // Handle array input
            this.initializeFromArray(inputObject);
        } else if (inputObject instanceof InfiniteNumberArithmetic) {
            // Handle InfiniteNumberArithmatic object input
            this.initializeFromArray(inputObject._internalArray);
        } else {
            throw new Error(`Constructor of InfiniteNumberArithmetic does not support this data type ${typeof inputObject}`);
        }
    }

    /**
     * Helper method to initialize the internal array from an array.
     * @param {Array<number>} array 
     */
    initializeFromArray(array) {
        this._internalArray = [...array];
    }

    /**
     * Helper method to convert a number to an array of digits.
     * @param {number} num 
     * @returns {Array<number>} 
     */
    convertNumberToArray(num) {
        if (isNaN(num)) {
            throw new Error("Input is NaN.");
        }
        if (num < 0) {
            throw new Error("Input cannot be negative.");
        }
        if (!Number.isInteger(num)) {
            throw new Error("Input needs to be an integral value.");
        }
        return Array.from(String(num), Number);
    }

    /**
     * Helper method to convert a string to an array of digits.
     * @param {string} str 
     * @returns {Array<number>} 
     */
    convertStringToArray(str) {
        if (str.length === 0) {
            throw new Error("Empty string is not accepted.");
        }
        if (!/^\d+$/.test(str)) {
            throw new Error("String can have decimal numbers only.");
        }
        return Array.from(str, Number);
    }

    /**
     * Helper method to return the internal array representing individual digits.
     * @returns {Array<number>} 
     */
    getInternalArray() {
        return this._internalArray.slice();
    }

    /**
     * Helper method to return the representation of this Infinite Precision as a string.
     * @returns {string} 
     */
    getNumberAsString() {
        return this._internalArray.join('');
    }

    /**
     * Function used to perform addition with another InfiniteNumberArithmatic object.
     * @param {InfiniteNumberArithmetic} obj 
     * @returns {InfiniteNumberArithmetic} 
     */
    addition(obj) {
        const resultArray = addArrays(this._internalArray, obj._internalArray);
        return new InfiniteNumberArithmetic(resultArray);
    }

    /**
     * Function used to perform subtraction with another InfiniteNumberArithmatic object.
     * @param {InfiniteNumberArithmetic} obj 
     * @returns {InfiniteNumberArithmetic} 
     */
    subtraction(obj) {
        const resultArray = subtractNumbers(this._internalArray, obj._internalArray);
        return new InfiniteNumberArithmetic(resultArray);
    }

    /**
     * Function used to perform multiplication with another InfiniteNumberArithmatic object.
     * @param {InfiniteNumberArithmetic} obj 
     * @returns {InfiniteNumberArithmetic} 
     */
    multiplication(obj) {
        const resultArray = multiply(this._internalArray, obj._internalArray);
        return new InfiniteNumberArithmetic(resultArray);
    }
}

// Add.js
/**
 * Function used to perform addition of two numbers stored in array format.
 * @param {Array<number>} arr1 The array representing number1
 * @param {Array<number>} arr2 The array representing number2
 * @returns {Array<number>} Returns an array representing the sum of arr1 and arr2
 */
function addArrays(arr1,arr2){

    // Check if aall value in array of number type
    if(arr1.every(num => typeof(num) !== 'number') || arr2.some(num => typeof(num) !== 'number')){
        console.error(`Both inputs should be of type  number instead of ${typeof(num)}.`)
            return []; // If either array is empty, return []
    }
    
    else{
        if (arr1.length === 0 || arr2.length === 0) {
            console.error("Both inputs should be non empty arrays.")
            return []; // If either array is empty, return []
        }
    
        // Check for negative numbers
        if (arr1.some(num => num < 0) || arr2.some(num => num < 0)) {
            console.error('Both inputs must be positive numbers.');
            return [];
        }
    
        // Check for decimal numbers in aaray
        if (arr1.some(num => num%1 !== 0) || arr2.some(num => num%1 !== 0)) {
            console.error('Both inputs must be integers.Input should not be in decimals.');
            return [];
        }
    }

    let result = [] // Store final sumr esult
    let carry = 0 // Store any carry value

    i = arr1.length -1 // Pointer to index of arr1
    j = arr2.length -1 // Pointer to index of arr2

    while(i >= 0 || j >= 0){

        let value1 = (i >= 0) ? arr1[i] : 0; // If arr1[i] does not exist, take value as zero
        let value2 = (j >= 0) ? arr2[j] : 0; // If arr2[j] does not exist, take value as zero

        let sum = value1 + value2 + carry
        let rem = sum%10
        result.unshift(rem)
        carry = Math.floor(sum/10)

        i -= 1 // Updating index of arr1
        j -= 1 // Updating indecx of arr2
    }

    if(carry){
        result.unshift(carry)
    }
    return result
}

// Sub.js
/**
 * Function is used to update the value of array when borrow is taken from previous number.
 * @param {Array<number>} arr The array in which to perform borrowing
 * @param {number} index Index of the array that requires borrowing  
 * @returns {void}
 */
function borrowFromPrevious(arr,index){
    
    if(arr[index-1] == 0){// if previous value if zero, we can take borrow from it.
        arr[index-1] = 9
        borrowFromPrevious(arr,index-1)
    }

    else{
        arr[index-1] -= 1
    }
    return arr
    
}

/**
 * Function is used to subtract the value of one number from another number,
 * where these numbers are stored in array format.
 * @param {Array<number>} arr1 The array from which other is subtracted
 * @param {Array<number>} arr2 The array which is subtracted
 * @returns {Array<number>} Function returns the array storing subtraction between two numbers
 */
function subtractNumbers(arr1,arr2){

    if(arr1.every(num => typeof(num) !== 'number') || arr2.some(num => typeof(num) !== 'number')){
        console.error(`Both inputs should be of type  number instead of ${typeof(num)}.`)
            return []; // If either array is empty, return []
    }
    
    else{
        if (arr1.length === 0 || arr2.length === 0) {
            console.error("Both inputs should be non empty arrays.")
            return []; // If either array is empty, return []
        }
    
        // Check for negative numbers
        if (arr1.some(num => num < 0) || arr2.some(num => num < 0)) {
            console.error('Both inputs must be positive numbers.');
            return [];
        }
    
        // Check for decimal numbers in aaray
        if (arr1.some(num => num%1 !== 0) || arr2.some(num => num%1 !== 0)) {
            console.error('Both inputs must be integers.Input should not be in decimals.');
            return [];
        }
    }


    let result = []
    
    i = arr1.length-1 // Pointer to index of arr1
    j = arr2.length-1 // Pointer to index of arr2

    while(i >= 0 || j >= 0){
        /**
         * if arr1 index i is less than arr2 index j,
         * then we take borrow from index beforre it
         */
        if(arr1[i] < arr2[j]){
            arr1[i] += 10
            borrowFromPrevious(arr1,i)
            // console.log(arr1)
        }

        let value1 = (arr1[i] !== undefined) ? arr1[i] : 0;
        let value2 = (arr2[j] !== undefined) ? arr2[j] : 0;

        let diff = value1 - value2
        result.unshift(diff);
        
        i -= 1
        j -= 1
    }
    return result
}

// Multiply.js
/**
 * Function multiply is used to return multiplication of two numbers in 
 * array format.
 * @param {Array<number>} arr1 First array representing a number to be multiplied
 * @param {Array<number>} arr2 Second array representing another number
 * @returns {Array<number>} Returns multiplied value of two numbers in array format 
 */
function multiply(arr1,arr2){
    
    if(arr1.every(num => typeof(num) !== 'number') || arr2.some(num => typeof(num) !== 'number')){
        console.error(`Both inputs should be of type  number instead of ${typeof(num)}.`)
            return []; // If either array is empty, return []
    }
    
    else{
        if (arr1.length === 0 || arr2.length === 0) {
            console.error("Both inputs should be non empty arrays.")
            return []; // If either array is empty, return []
        }
    
        // Check for negative numbers
        if (arr1.some(num => num < 0) || arr2.some(num => num < 0)) {
            console.error('Both inputs must be positive numbers.');
            return [];
        }
    
        // Check for decimal numbers in aaray
        if (arr1.some(num => num%1 !== 0) || arr2.some(num => num%1 !== 0)) {
            console.error('Both inputs must be integers.Input should not be in decimals.');
            return [];
        }
    } 

    // Initialize the result array with zero
    let result = [0]
    let j = arr2.length - 1;
    let count = 0

    while(j>=0)
    {
        let base_sum = [0]
        
        // Repeat addition of arr1 'arr2[j]' times
        while(arr2[j] > 0){
            base_sum = addArrays(base_sum,arr1)
            arr2[j] -= 1
        }

        // Shift the base sum by 'count' places to the left
        for (let i = 0; i < count; i++) {
            base_sum.push(0);
        }
        count++;

        // Add the base sum to the result
        result = addArrays(result,base_sum)
        j -= 1
    }
    return result
}

module.exports = { InfiniteNumberArithmetic };


// Test addition
function testAddition() {
    const num1 = new InfiniteNumberArithmetic(123);
    const num2 = new InfiniteNumberArithmetic(456);
    const result = num1.addition(num2);
    console.log("Addition:", result.getNumberAsString());
}

// Test subtraction
function testSubtraction() {
    const num1 = new InfiniteNumberArithmetic(1000);
    const num2 = new InfiniteNumberArithmetic(123);
    const result = num1.subtraction(num2);
    console.log("Subtraction:", result.getNumberAsString());
}

// Test multiplication
function testMultiplication() {
    const num1 = new InfiniteNumberArithmetic(123);
    const num2 = new InfiniteNumberArithmetic(456);
    const result = num1.multiplication(num2);
    console.log("Multiplication:", result.getNumberAsString());
}

// Run tests
testAddition();
testSubtraction();
testMultiplication();
