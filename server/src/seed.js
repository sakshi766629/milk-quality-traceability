import dotenv from "dotenv";
import mongoose from "mongoose";
import Batch from "./models/Batch.js";
import { analyzeQuality } from "./utils/analyze.js";
dotenv.config();

const samples = [
 ["Asha Patil","F-101","Kada Collection Centre",220,28,6.62,320,4.2,1.028,42],
 ["Rahul Shinde","F-102","Kada Collection Centre",180,5,6.65,315,4.1,1.029,40],
 ["Meena Jadhav","F-103","Shirur Collection Centre",150,6,6.58,330,4.3,1.027,44],
 ["Vijay Pawar","F-104","Kada Collection Centre",260,10,6.61,350,4.5,1.028,43],
 ["Sunita Kale","F-105","Rahuri Collection Centre",195,7,6.42,410,5.2,1.025,48],
 ["Ganesh More","F-106","Shirur Collection Centre",300,12,6.35,500,6.1,1.022,53],
 ["Pooja Gaikwad","F-107","Rahuri Collection Centre",175,4,6.70,305,4.0,1.030,39],
 ["Nitin Bhosale","F-108","Kada Collection Centre",210,9,6.55,370,4.7,1.026,46],
 ["Kavita Deshmukh","F-109","Shirur Collection Centre",140,18,6.20,920,8.2,1.018,72],
 ["Prakash Salunkhe","F-110","Rahuri Collection Centre",280,6,6.63,325,4.2,1.028,41]
];
await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/milk_quality_traceability");
await Batch.deleteMany({});
for (let i=0;i<samples.length;i++) {
  const [farmerName,farmerId,collectionCentre,quantityLitres,temperature,ph,tds,conductivity,density,colourValue] = samples[i];
  const reading = { temperature, ph, tds, conductivity, density, colourValue };
  const analysis = analyzeQuality(reading);
  const batchId = `MILK-2026-${String(i+1).padStart(3,"0")}`;
  const readings = [{
    stage:1, stageName:"Collection Centre", timestamp:new Date(Date.now()-(i*86400000)),
    ...reading, status:analysis.status, deviatedParameters:analysis.deviatedParameters, recommendation:analysis.recommendation
  }];
  if ([0,4,8].includes(i)) {
    const stage2 = { temperature: i===8?20:6, ph: i===8?6.25:6.55, tds: i===8?850:340, conductivity: i===8?7.8:4.8, density: i===8?1.019:1.027, colourValue: i===8?69:45 };
    const a2=analyzeQuality(stage2);
    readings.push({stage:2,stageName:"Dairy Processing",timestamp:new Date(),...stage2,status:a2.status,deviatedParameters:a2.deviatedParameters,recommendation:a2.recommendation});
    if (i!==8) {
      const stage3={temperature:7,ph:6.51,tds:355,conductivity:5.6,density:1.027,colourValue:47};
      const a3=analyzeQuality(stage3);
      readings.push({stage:3,stageName:"Distribution / Consumer",timestamp:new Date(),...stage3,status:a3.status,deviatedParameters:a3.deviatedParameters,recommendation:a3.recommendation});
    }
  }
  const finalStatus=readings.some(r=>r.status==="HIGH DEVIATION")?"HIGH DEVIATION":readings.some(r=>r.status==="QUALITY DEVIATION")?"QUALITY DEVIATION":"NORMAL";
  await Batch.create({batchId,farmerName,farmerId,collectionCentre,quantityLitres,collectionDate:new Date(Date.now()-(i*86400000)),currentStage:readings[readings.length-1].stage,readings,finalStatus});
}
console.log("Seeded 10 demo milk batches.");
await mongoose.disconnect();
