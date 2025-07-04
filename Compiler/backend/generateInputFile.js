const fs=require("fs");
const path=require("path");
const {v4:uuid}=require('uuid');


const dirInputs=path.join(__dirname, "input"); //C:\Users\patha\Desktop\Compiler\backend\codes
if(!fs.existsSync(dirInputs)){
    fs.mkdirSync(dirInputs,{recursive:true});
}
const generateInputFile=(input)=>{
    const jobId=uuid(); //bd283699-80f9-4a63-9e8d-bf09515432
    const inputFilename=`${jobId}.txt`; //bd283699-80f9-4a63-9e8d-bf09515432
    const inputFilePath=path.join(dirInputs, inputFilename);
    fs.writeFileSync(inputFilePath, input+'\n');
    return inputFilePath;
}

module.exports=generateInputFile;