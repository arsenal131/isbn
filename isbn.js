'use strict';

const readline = require('readline');
const conf = require('./conf.js');

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

module.exports = class isbn{

  constructor(){

    this.menu;

  }

  get menu(){
    this.__menu();
  }

  __menu(){

    console.log("===============================");
    console.log('MENU');
    console.log('1. check digit');
    console.log('2. convert isbn type');
    console.log('0. exit');
    console.log("===============================");

    let tis = this;

    readLine.question('Choose number & press <Enter> : ', (answer)=>{
      answer = parseInt( answer.replace( /[^0-9]+/g, '' ) );
      switch(answer){
        case 1:
          tis.check_digit;
          break;
        case 2:
          tis.convert;
          break;
        case 0:
          tis.exit;
          break;
        default:
          console.log("Option #${answer} is not available. Please pick from available options.");
          tis.menu;
          break;
      }
    });
    return;
  }

  get check_digit(){
    this.__check_digit();
  }

  __check_digit(){

    readLine.question('ISBN : ', function(inISBN){
      this.inputedISBN = inISBN.replace(/[^0-9]/g, '');
      console.log(`You entered ISBN ${this.inputedISBN.length}`);
      switch(this.inputedISBN.length){
        case 13:
          this.isbn13;
          break;
        case 10:
          this.isbn10;
          break;
        default:
          console.log("System only supports ISBN 10 and ISBN 13");
          break;
      }
      readLine.question('go to menu? (1 = yes)', function(answer){
        switch(parseInt(answer)){
          case 1:
            this.menu;
            break;
          default:
            this.exit;
            break;
        }
      }.bind(this));
      //readLine.close();
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

    let check_digit = this.lastDigitISBN13;

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

  get lastDigitISBN13(){
    return this.__lastDigitISBN13();
  }

  __lastDigitISBN13(){
    
    let isbn13 = "0" + this.inputedISBN;
    let event = [];
    let odd = [];

    let arr = isbn13.split('');

    if(!!conf.showProcess){
      console.log("\x1b[4m", "First 12 digits x [1|3] = the results", "\x1b[0m");
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
      console.log('\x1b[4m', 'Add the results', '\x1b[0m');
    };

    let sum_genap = (event.reduce((a,b)=>{return a+b}));
    let sum_ganjil = (odd.reduce((a,b)=>{return a+b}))
    let total = sum_genap + sum_ganjil;

    if(!!conf.showProcess){
      console.log(`total = ${total}`);
      console.log('\x1b[4m', 'Modulo the total','\x1b[0m');
    }

    let res_mod = total % 10;

    if(!!conf.showProcess){
      console.log(`${total} mod 10 = ${res_mod}`)
      console.log(`Remainder = ${res_mod}`);
      console.log('\x1b[4m', 'Check digit', '\x1b[0m');
    }

    let check_digit = ( res_mod === 0 ) ? res_mod  : 10 - res_mod;

    return check_digit;

  }

  get isbn10(){
    this.__isbn10();
  }

  __isbn10(){
    let isbn10 = "0" + this.inputedISBN;
    let arr = isbn10.split("");
    let the_result = [];
    if(!!conf.showProcess){
      console.log("\x1b[4m", "First 9 digits x [10...2] = the result", "\x1b[0m");
    }
    for(let i=10; i>1; i--){
      the_result.push( arr[11-i] * i );
      if(!!conf.showProcess){
        console.log(arr[11-i], 'x'  , i, ' = ', arr[11-i] * i );
      }
    }
    if(!!conf.showProcess){
      console.log("\x1b[4m", "Add the results", "\x1b[0m");
    }
    let total = the_result.reduce((a,b)=>{return a+b});
    if(!!conf.showProcess){
      console.log(the_result.join(' + ') , " = ", total);
      console.log("\x1b[4m", "modulo 11", "\x1b[0m");
    }
    let remainder = total % 11;
    if(!!conf.showProcess){
      console.log(`${total} mod 11 = ${remainder}`);
      console.log("\x1b[4m", "check digit", "\x1b[0m");
    }
    let check_digit = ((remainder === 0) ? 0 : 11 - remainder);
    if(remainder !== 0 && !!conf.showProcess){
      console.log(`11 - ${remainder} = ${check_digit}`);
      console.log(`check digit : ${check_digit}`);
    }

    let inputed_check_digit = parseInt(arr[10]);
    let calculated_check_digit =  check_digit;

    if(inputed_check_digit === calculated_check_digit){
      console.log('ISBN number is correct');
    }else{
      console.log('ISBN number is incorrect');
    }

  }

  get convert(){
    this.__convert();
  }

  __convert(){

    readLine.question("ISBN source : ", function(inISBN){
      this.inputedISBN = inISBN.replace(/[^0-9]/g,'');
      console.log(`You entered ISBN ${this.inputedISBN.length}`);
      switch(this.inputedISBN.length){
        case 10:
          let resISBN13 = this.convert10to13;
          console.log(resISBN13);
          break;
        case 13:
          console.log("currently not available");
          break;
      }
      readLine.question("\nGo to menu? (1=yes)", function(response){
        switch(parseInt(response)){
          case 1:
            this.menu;
            break;
          default:
            this.exit;
            break;
        }
      }.bind(this));
    }.bind(this));

  }

  get convert10to13(){
    return this.__convert10to13();
  }

  __convert10to13(){
    let isbn10 = this.inputedISBN;
    let arr = isbn10.split("").map( x =>{ return parseInt(x) });
    if(!!conf.showProcess){
      console.log('Take all digits and drop the final digit');
    }
    arr.pop();
    if(!!conf.showProcess){
      console.log( arr );
      console.log('Prepend the digits "978" onto the digits.');
    }
    arr.splice(0,0,9);
    arr.splice(1,0,7);
    arr.splice(2,0,8);
    this.inputedISBN = arr.join('');
    if(!!conf.showProcess){
      console.log(this.inputedISBN);
    }
    let last = this.lastDigitISBN13;
    last = (last === 0) ? 0 : 10 - last;
    return (`${this.inputedISBN}${last}`);
  }

  get exit(){
    this.__exit();
  }

  __exit(){
    process.exit();
  }

}
