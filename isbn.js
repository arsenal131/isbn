'use strict';

const readline = require('readline');
const conf = require('./conf.js');

module.exports = class isbn{

  constructor(){

    const readLine = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readLine.question('ISBN 13 : ', function(inISBN){
      this.inputedISBN = inISBN;
      console.log(`You entered ISBN ${this.inputedISBN.length}`);
      switch(this.inputedISBN.length){
        case 13:
          this.isbn13;
          break;
        case 10:
          console.log('isbn 10 calculation is not available yet');
          break;
      }

      readLine.close();
    }.bind(this));

  }

  get isbn13(){
    this.__isbn13();
  }

  __isbn13(){

    let isbn13 = "0" + this.inputedISBN;
    let event = [];
    let odd = [];

    let arr = isbn13.split('');

    if(!!conf.showProcess){
      console.log("\x1b[4m", "Step 1: First 12 digits x [1|3] = the results", "\x1b[0m");
    }

    for(let i=1; i<13; i++){
      if(i%2 === 0){ //genap
        if(!!conf.showProcess){
          console.log(`digit ke-${i}: ${arr[i]} x 3 = ${arr[i] * 3}`);
        };
        event.push(3 * parseInt(arr[i]));
      }else if(i%2 >0){  //ganjil
        if(!!conf.showProcess){
          console.log(`digit ke-${i}: ${arr[i]} x 1 = ${arr[i] * 1}`);
        };
        odd.push(1 * parseInt(arr[i]));
      };
    };

    if(!!conf.showProcess){
      console.log('\x1b[4m', 'Step 2: Add the results', '\x1b[0m');
    };

    let sum_genap = (event.reduce((a,b)=>{return a+b}));
    let sum_ganjil = (odd.reduce((a,b)=>{return a+b}))
    let total = sum_genap + sum_ganjil;

    if(!!conf.showProcess){
      console.log(`total = ${total}`);
      console.log('\x1b[4m', 'Step 3: Modulo the total','\x1b[0m');
    }

    let res_mod = total % 10;

    if(!!conf.showProcess){
      console.log(`${total} mod 10 = ${res_mod}`)
      console.log(`Remainder = ${res_mod}`);
      console.log('\x1b[4m', 'Step 4: Check digit', '\x1b[0m');
    }

    let check_digit = ( res_mod === 0 ) ? res_mod  : 10 - res_mod;

    if(!!conf.showProcess){
      console.log(`check_digit = ${check_digit}`);
      console.log('\x1b[4m', 'Step 5: Compare the calculated check digit to inputed check digit', '\x1b[0m');
    }

    let inputed_check_digit = parseInt(arr[13]);
    let calculated_check_digit = check_digit;
    if(!!conf.showProcess){
      console.log(`inputed check digit : ${inputed_check_digit}`)
      console.log(`calculated check digit : ${calculated_check_digit}`);
    }
    if(inputed_check_digit === calculated_check_digit){
      console.log("ISBN number is correct");
    } else {
      console.log("ISBN number is incorrect");
    }

  }

}


