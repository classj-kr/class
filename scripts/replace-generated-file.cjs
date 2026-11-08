"use strict";
const fs=require('node:fs');

// Windows scanners and the local preview server can briefly hold a generated
// file open. Keep the previous complete file until its replacement can commit.
module.exports=function replaceGeneratedFile(destination,data){
 const temporary=destination+'.tmp';fs.writeFileSync(temporary,data);
 for(let attempt=0;;attempt++){
  try{fs.renameSync(temporary,destination);return;}
  catch(error){
   if(attempt>=9||!['EPERM','EACCES','EBUSY'].includes(error.code))throw error;
   Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,100+attempt*75);
  }
 }
};
