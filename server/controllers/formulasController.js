const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Formula = require("../model/Formula");
const math = require("mathjs");
const userModel = require("../model/User")
const jwt = require("jsonwebtoken");
const PDFDocument = require('pdfkit');
const fs = require('fs');


const filteredPoints = {};
const filteredbackviewPoints = {};
const filteredgridviewPoints = {};
const translatedPoints = {};

const TrouserCalculation = asyncHandler(async (req, res) => {
  const { values } = req.body;
  const { A, B, C, D, E, F } = values;

  try {
    const formulas = await Formula.find();
    const calculatedPoints = {};
    formulas.forEach((formula) => {
      let expression = formula.expression;
      const expressionFunction = eval("(" + expression + ")");
      const result = expressionFunction(A, B, C, D, E, F);
      console.log(result);
      calculatedPoints[formula.key] = result;
    });

    const pointsToSend = ["3","6","8","9","10","11","12","13","14","15","30","32","33","38","39","40","5",];
    const backpointsToSend = ["0","21","19","24","29","28","26","27","25","22","31","34","35","36","37"]; 
    const gridpointsToSend = ["0","7","18","22","17","6","2","25","1","16","5","23","24","29","15","4","27","3","26","28"];
    pointsToSend.forEach((key) => {
      if (calculatedPoints[key]) {
        filteredPoints[key] = calculatedPoints[key];
      }
    });

    backpointsToSend.forEach((key) => {
      if (calculatedPoints[key]) {
        filteredbackviewPoints[key] = calculatedPoints[key];
      }
    });

    gridpointsToSend.forEach((key) => {
      if (calculatedPoints[key]) {
        filteredgridviewPoints[key] = calculatedPoints[key];
      }
    });

    // Calculate translation values
    const minX = Math.min(...Object.values(calculatedPoints).map(point => point.x));
    const minY = Math.min(...Object.values(calculatedPoints).map(point => point.y));
    const translateX = 50 - minX; // Adjust 50 according to your margin requirement
    const translateY = 50 - minY; // Adjust 50 according to your margin requirement

    // Translated points
    Object.entries(calculatedPoints).forEach(([key, point]) => {
      const { x, y } = point;
      translatedPoints[key] = { x: x + translateX, y: y + translateY };
    });

    // Output translated points
    console.log("translated points",translatedPoints);

    res.json({
      success: true,
      calculatedPoints,
      filteredPoints,
      filteredbackviewPoints,
      filteredgridviewPoints,
    });
    console.log(calculatedPoints);
  } catch (error) {
    console.error("Error calculating points:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
  
const calculateDistance=(x1, y1, x2, y2)=> {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
const firstSplitpairs = [[10, 11], [10, 40], [38, 38], [40, 40]]; 
const secondSplitpairs=[[11,8],[32,32]];
const thirdSplitpairs=[[40,6],[6,9],[9,9],[40,40]];
const fourthSplitpairs=[[8,8],[8,13]]
const fifthSplitpairs=[[13,13],[8,13]]
const sixthSplitpairs=[[9,15],[15,14]]

  const pairs = [
    [10, 11],[10,6],[6,9],[9, 15],[15, 14],[14, 12],[13,12],[8,13],[11,8],[30,30],[32,32],[33,33],[6,6],[8,8],[40,40],[38,38],[13,13],[12,12],[15,15],
  ];

const generatePDF = () => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({size:'A4',layout:"portrait"});

        const buffers = [];
        doc.on('data', buffer => buffers.push(buffer));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', err => reject(err));
        doc.fontSize(12).font('Helvetica');
        doc.lineWidth(2); 
        const margin=2*28.35
        const width1 = doc.page.width;
        const height1 = doc.page.height;
        doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin+(29.7*5-2*5)).lineTo(width1-margin,margin+(29.7*5-2*5)).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin+(59.4*5-2*5)).lineTo(width1-margin,margin+(59.4*5-2*5)).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin+(89.1*5-2*5)).lineTo(width1-margin,margin+(89.1*5-2*5)).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin+(118.8*5-2*5)).lineTo(width1-margin,margin+(118.8*5-2*5)).dash(10, {space: 8}).stroke();



        // doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        // doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();

        doc.moveTo(margin,margin).lineTo(width1-(21*5-2*5)-margin,margin).lineTo(width1-(21*5-2*5)-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(width1-(42*5-2*5)-margin,margin).lineTo(width1-(42*5-2*5)-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(width1-(21*3*5-2*5)-margin,margin).lineTo(width1-(21*3*5-2*5)-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(width1-(21*4*5-2*5)-margin,margin).lineTo(width1-(21*4*5-2*5)-margin,height1-margin).dash(10, {space: 8}).stroke();
        // doc.moveTo(margin,margin).lineTo(width1-(50*5)-margin,margin).lineTo(width1-(50*5)-margin,height1-margin).dash(10, {space: 8}).stroke();
        // doc.moveTo(margin,margin).lineTo(width1-(60*5)-margin,margin).lineTo(width1-(60*5)-margin,height1-margin).dash(10, {space: 8}).stroke();




        doc.moveTo(margin,margin).lineTo(margin,height1-margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();

        doc.undash();
        const coordinate=210;
        const mulref=5;
        // referencevector:
        // doc.moveTo(-10,-20).lineTo(0,-26).stroke()
        for (let i = 0; i < pairs.length; i++) {
        const [u, v] = pairs[i];
        const point1 = filteredPoints[u];
        const point2 = filteredPoints[v];
        const { x: x1, y: y1 } = point1;
        const { x: x2, y: y2 } = point2;
        if (u===10 && v===11) {
        const distance=calculateDistance(x1,y1,x2,y2);
        const l2=x2+coordinate+(distance*mulref)-distance;
        const h2=y2+coordinate;
        const l1=x1+coordinate;
        const h1=y1+coordinate;
        // doc.moveTo(l1,h1).lineGap(distance);
        doc.moveTo(l1,h1).lineTo(l2,h2).stroke();

      }else if (u===10 && v===6) {
        const distance=calculateDistance(x1,y1,x2,y2);
        const l2=x2+coordinate;
        const h2=y2+coordinate+(distance*mulref)+distance;
        const l1=x1+coordinate;
        const h1=y1+coordinate;
        doc.moveTo(l1,h1).lineTo(l2,h2).stroke();

      }
      else if (u===6 && v===9) {
        const {x:x4,y:y4}=filteredPoints[10]
        const dis1=calculateDistance(x4,y4,x1,y1); //10-6
        const {x:x3, y:y3} = filteredPoints[5]

        const dis2=calculateDistance(x3,y3,x4,y4); //10-5
        const dis=calculateDistance(x3,y3,x2,y2); //5-9
        const distance=calculateDistance(x1,y1,x2,y2); //6-9
        const l2=x2+coordinate-dis*mulref+dis;
        const h2=y2+coordinate+dis2*mulref-dis2+distance*mulref+distance;
        const l1=x1+coordinate;
        const h1=y1+coordinate+dis1*mulref+dis1;
        const midx=((l1+l2)/2)+(2.121320344*mulref)
        const midy=(h1+h2)/2;
        doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
        console.log(`${u}, ${v} distance converted is`,calculateDistance(l1,h1,l2,h2));       
      }else if(u===11 && v===8){
        const distance=calculateDistance(x1,y1,x2,y2);
        const {x:x3,y:y3}=filteredPoints[10];
        const {x:x4,y:y4}=filteredPoints[6];
        const {x:x5,y:y5}=filteredPoints[32];
        const {x:x6,y:y6}=filteredPoints[40];
        const dis2=calculateDistance(x5,y5,x6,y6);
        const dis1=calculateDistance(x2,y2,x4,y4);
        const dis=calculateDistance(x3,y3,x1,y1);
        const h2=y2+coordinate+distance*mulref+distance;
        const l2=x2+coordinate+(dis1*mulref)-dis1;
        const l1=x1+coordinate+(dis*mulref)-dis;
        const h1=y1+coordinate;
        const midx=x5+coordinate+dis2*mulref-dis2;
        const midy=y5+coordinate;
        doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
        // console.log(`${u}, ${v} distance converted is`,calculateDistance(l1,h1,l2,h2));       
      }else if (u===8 && v===13) {
        const {x:x3,y:y3}=filteredPoints[6];
        const {x:x5,y:y5}=filteredPoints[11];
        const {x:x6,y:y6}=filteredPoints[14];
        const {x:x7,y:y7}=filteredPoints[15];
        const midx1=(x6+x7)/2
        const midy1=(y6+y7)/2+3
        const dis3=(calculateDistance(midx1,midy1,x2,y2))
        const dis=calculateDistance(x1,y1,x3,y3);
        const distance=calculateDistance(x1,y1,x2,y2);
        const dis1=calculateDistance(x1,y1,x5,y5);
        const l2=x2+coordinate+dis3*mulref-dis3; //13
        const h2=y2+coordinate+distance*mulref+dis1*mulref+distance+dis1;
        const l1=x1+coordinate+dis*mulref-dis; //8
        const h1=y1+coordinate+dis1*mulref+dis1;
        doc.moveTo(l1,h1).lineTo(l2,h2).stroke();
        // console.log(`${u}, ${v} distance converted is`,calculateDistance(l1,h1,l2,h2));
      }else if (u===13 && v===12) {
        const {x:x3,y:y3}=filteredPoints[11];
        const {x:x6,y:y6}=filteredPoints[14];
        const {x:x7,y:y7}=filteredPoints[15];
        const midx1=(x6+x7)/2
        const midy1=(y6+y7)/2+3
        const dis4=calculateDistance(x6,y6,x2,y2)
        const dis3=(calculateDistance(midx1,midy1,x1,y1))
        const dis=calculateDistance(x1,y1,x3,y3);
        const distance=calculateDistance(x1,y1,x2,y2);
        const l2=x2+coordinate+dis4*mulref-dis4; //12
        const h2=y2+coordinate+dis*mulref+dis+distance*mulref+distance;
        const l1=x1+coordinate+(dis3*mulref)-dis3; //13
        const h1=y1+coordinate+dis*mulref+dis;
        doc.moveTo(l1,h1).lineTo(l2,h2).stroke();
        // console.log(`${u}, ${v} distance converted is`,calculateDistance(l1,h1,l2,h2));
      }else if(u===9 && v===15){
        const distance=calculateDistance(x1,y1,x2,y2);
        const {x:x3,y:y3}=filteredPoints[10];
        const {x:x4,y:y4}=filteredPoints[5];
        const dis3=(x3-x2)*mulref;
        const dist1=calculateDistance(x3,y3,x4,y4);
        const dist2=calculateDistance(x1,y1,x4,y4);
        const h2=y2+coordinate+distance*mulref+distance+dist1*mulref+dist1;
        const l2=x2+coordinate-dis3;
        const l1=x1+coordinate-dist2*mulref+dist2;
        const h1=y1+coordinate+dist1*mulref+dist1;
        const midx=(l1+l2)/2+(0.75*mulref);
        const midy=(h1+h2)/2;
        doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
        console.log(`${u}, ${v} distance converted is`,calculateDistance(l1,h1,l2,h2));       
      }else if (u===15 && v===14) {
        const {x:x3,y:y3}=filteredPoints[10];
        const dis3=(x3-x1)*mulref

        const dis=calculateDistance(x1,y1,x3,y3);
        const distance=calculateDistance(x1,y1,x2,y2);
        const l2=x2+coordinate; 
        const h2=y2+coordinate+distance*mulref+distance+dis*mulref+dis;
        const l1=x1+coordinate-dis3; 
        const h1=y1+coordinate+dis*mulref+dis;
        doc.moveTo(l1,h1).lineTo(l2,h2).stroke();
        console.log(`${u}, ${v} distance converted is`,calculateDistance(l1,h1,l2,h2));       

        // console.log("distance btw 15 and midpoint",dis1)
        // console.log(`${u}, ${v} distance converted is`,l1,h1,midx1+coordinate,midy1+coordinate+dis*mulref+dis,calculateDistance(l1,h1,midx1+coordinate,midy1+coordinate+dis*mulref+dis));
      }else if (u===14 && v===12) {
        const distance=calculateDistance(x1,y1,x2,y2);
        const {x:x3,y:y3}=filteredPoints[10]
        const {x:x4,y:y4}=filteredPoints[11]
        const dis2=calculateDistance(x2,y2,x4,y4);
        const dis1=calculateDistance(x1,y1,x3,y3);
        const l2=x2+coordinate+(distance*mulref)-distance;
        const h2=y2+coordinate+dis2*mulref+dis2;
        const l1=x1+coordinate;
        const h1=y1+coordinate+dis1*mulref+dis1;
        // doc.moveTo(l1,h1).lineGap(distance);
        doc.moveTo(l1,h1).lineTo(l2,h2).stroke();
        console.log(`${u}, ${v} distance converted is`,calculateDistance(l1,h1,l2,h2));       


      }
        }



        doc.addPage({size:"A4",layout:"landscape"});
        doc.lineWidth(2);
        const width = doc.page.width;
        const height = doc.page.height;
        //Width: 841.89 Height: 595.28
        // console.log("Width:", width, "Height:", height);
        doc.moveTo(margin,margin).lineTo(width-margin,margin).lineTo(width-margin,height-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(margin,height-margin).lineTo(width-margin,height-margin).dash(10, {space: 8}).stroke();
        doc.undash();

        const mul=28.35;
        const coord=100;
        // front-view:
        // frontview-1st split:
        for (let i = 0; i < firstSplitpairs.length; i++) {
              const [u, v] = firstSplitpairs[i];
              const point1 = filteredPoints[u];
              const point2 = filteredPoints[v];
              const { x: x1, y: y1 } = point1;
              const { x: x2, y: y2 } = point2;
              const distance=calculateDistance(x1,y1,x2,y2)*mul;
              if (u===10 && v===11){
                const l2=x2+distance+coord;
                const h2=y2+coord;
                const l1=x1+coord;
                const h1=y1+coord;
                doc.moveTo(l1,h1).lineTo(l2,h2).stroke();
              }else{
                const h2=y2+distance+coord;
                const l2=x2+coord;
                const l1=x1+coord;
                const h1=y1+coord;
                doc.moveTo(l1,h1).lineTo(l2,h2).stroke();
              }
              console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))

        }

        // for (let i = 0; i < thirdSplitpairs.length; i++) {
        //       const [u, v] = thirdSplitpairs[i];
        //       const point1 = filteredPoints[u];
        //       const point2 = filteredPoints[v];
        //       const { x: x1, y: y1 } = point1;
        //       const { x: x2, y: y2 } = point2;
        //       console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))
        // }
        // for (let i = 0; i < fourthSplitpairs.length; i++) {
        //       const [u, v] = fourthSplitpairs[i];
        //       const point1 = filteredPoints[u];
        //       const point2 = filteredPoints[v];
        //       const { x: x1, y: y1 } = point1;
        //       const { x: x2, y: y2 } = point2;
        //       console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))

        // }
        // const linelengthp=16.75*28.35;
        // const x1 = 11.833333333333332 + 75 + linelengthp;
        // const y1 = 75;
        // const x2 = 75+13.583333333333334+linelengthp+(1.750000000000002*28.35);
        // const y2 = 75 - 10.5 + (10.644834428022 * 28.35);

        // // // Calculate the midpoint
        // const midpointX = (x1 + x2) / 2;
        // const midpointY = (y1 + y2) / 2;
        // doc.moveTo(-4.916666666666668+75,75).lineTo(11.833333333333332+75+linelengthp,75).quadraticCurveTo(midpointX+(0.5*28.35),midpointY, 75+13.583333333333334+linelengthp+(1.750000000000002*28.35), 75-10.5+(10.644834428022*28.35)).stroke();
        // .lineTo(midpointX+(0.5*28.35),midpointY).lineTo(50+13.583333333333334+linelengthp, 50-10.5+(10.644834428022*28.35)).stroke();
        
        doc.addPage({size:"A4",layout:"portrait"});
        doc.lineWidth(2);
        doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(margin,height1-margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.undash();

        // frontview-2nd split:
        for (let i = 0; i < secondSplitpairs.length; i++) {
              const [u, v] = secondSplitpairs[i];
              const point1 = filteredPoints[u];
              const point2 = filteredPoints[v];
              const { x: x1, y: y1 } = point1;
              const { x: x2, y: y2 } = point2;
              const distance=calculateDistance(x1,y1,x2,y2)*mul;
              if(u===11 && v===8){
                const h2=y2+distance+coord;
                const l2=x2+coord;
                const l1=x1+coord;
                const h1=y1+coord;
                const midx=((l1+l2)/2)+(0.5*mul)
                const midy=(h1+h2)/2;
                doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
              }
              console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))
        }
        doc.addPage({size:"A4",layout:"portrait"});
        doc.lineWidth(2);

        doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(margin,height1-margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.undash();


        // frontview-3rd split:
        const coord1x=400
        const coord1y=100

        for (let i = 0; i < thirdSplitpairs.length; i++) {
              const [u, v] = thirdSplitpairs[i];
              const point1 = filteredPoints[u];
              const point2 = filteredPoints[v];
              const { x: x1, y: y1 } = point1;
              const { x: x2, y: y2 } = point2;
              const distance=calculateDistance(x1,y1,x2,y2)*mul;
              if (u===40 && v===6){
                const l2=x2+coord1x;
                const h2=y2+coord1y+distance;
                const l1=x1+coord1x;
                const h1=y1+coord1y;
                doc.moveTo(l1,h1).lineTo(l2,h2).stroke();
              }else if(u===6 && v===9){
                const {x:x4, y:y4} = filteredPoints[40];
                const {x:x3, y:y3} = filteredPoints[5];
                const dis1=calculateDistance(x2,y2,x3,y3);
                const dis=calculateDistance(x4,y4,x1,y1)*mul;
                const h2=y2+distance+coord1y+dis;
                const l2=x2+coord1x-(dis1*mul);
                const l1=x1+coord1x;
                const h1=y1+coord1y+dis;
                const midx=((l1+l2)/2)+(2.121320344*mul)
                const midy=(h1+h2)/2;
                doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
              }
              console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))
        }
        doc.addPage({size:"A4",layout:"portrait"});
        doc.lineWidth(2);
        doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(margin,height1-margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.undash();

        // frontview-4th split:
        for (let i = 0; i < fourthSplitpairs.length; i++) {
              const [u, v] = fourthSplitpairs[i];
              const point1 = filteredPoints[u];
              const point2 = filteredPoints[v];
              const { x: x1, y: y1 } = point1;
              const { x: x2, y: y2 } = point2;
              const distance=calculateDistance(x1,y1,x2,y2)*mul;
              // if(u===32 && v===8){
              //   const h2=y2+distance+coord;
              //   const l2=x2+coord;
              //   const l1=x1+coord;
              //   const h1=y1+coord;
              //   const midx=((l1+l2)/2)+(0.5*mul)
              //   const midy=(h1+h2)/2;
              //   doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
              // }
              if (u===8 && v===13){
                const l2=x2+coord;
                const h2=y2+coord+distance;
                const l1=x1+coord;
                const h1=y1+coord;
                const midx=(l1+l2)/2
                const midy=(h1+h2)/2
                doc.moveTo(l1,h1).lineTo(midx,midy).stroke();
              }
              console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))
        }
        doc.addPage({size:"A4",layout:"portrait"});
        doc.lineWidth(2);
        doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(margin,height1-margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.undash();
        // frontview-5th split:
        for (let i = 0; i < fifthSplitpairs.length; i++) {
              const [u, v] = fifthSplitpairs[i];
              const point1 = filteredPoints[u];
              const point2 = filteredPoints[v];
              const { x: x1, y: y1 } = point1;
              const { x: x2, y: y2 } = point2;
              const distance=calculateDistance(x1,y1,x2,y2)*mul;
              // if(u===32 && v===8){
              //   const h2=y2+distance+coord;
              //   const l2=x2+coord;
              //   const l1=x1+coord;
              //   const h1=y1+coord;
              //   const midx=((l1+l2)/2)+(0.5*mul)
              //   const midy=(h1+h2)/2;
              //   doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
              // }
              if (u===8 && v===13){
                const midx=((x1+x2)/2)+coord;
                const midy=((y1+y2)/2)+coord;
                const l2=x2+coord;
                const h2=y2+coord+(distance/2);
                const l1=x1+coord;
                const h1=y1+coord;
                doc.moveTo(midx,midy).lineTo(l2,h2).stroke();
              }
              console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))
        }
        doc.addPage({size:"A4",layout:"portrait"});
        doc.lineWidth(2);
        doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(margin,height1-margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.undash();
        // frontview-6th split:
        for (let i = 0; i < sixthSplitpairs.length; i++) {
              const [u, v] = sixthSplitpairs[i];
              const point1 = filteredPoints[u];
              const point2 = filteredPoints[v];
              const { x: x1, y: y1 } = point1;
              const { x: x2, y: y2 } = point2;
              const distance=calculateDistance(x1,y1,x2,y2)*mul;
              if(u===9 && v===15){
                const h2=y2+distance+coord;
                const l2=x2+coord;
                const l1=x1+coord;
                const h1=y1+coord;
                const midx=((l1+l2)/2)+(0.75*mul)
                const midy=(h1+h2)/2;
                doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
              }
              // else if (u===15 && v===14){
              //   const l2=x2+coord;
              //   const h2=y2+coord+distance;
              //   const l1=x1+coord;
              //   const h1=y1+coord;
              //   const midx=(l1+l2)/2
              //   const midy=(h1+h2)/2
              //   doc.moveTo(l1,h1).lineTo(midx,midy).stroke();
              // }
              console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))
        }
        doc.addPage({size:"A4",layout:"portrait"});
        doc.lineWidth(2);
        doc.moveTo(margin,margin).lineTo(width1-margin,margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.moveTo(margin,margin).lineTo(margin,height1-margin).lineTo(width1-margin,height1-margin).dash(10, {space: 8}).stroke();
        doc.undash();
        // frontview-7th split:
        for (let i = 0; i < sixthSplitpairs.length; i++) {
              const [u, v] = sixthSplitpairs[i];
              const point1 = filteredPoints[u];
              const point2 = filteredPoints[v];
              const { x: x1, y: y1 } = point1;
              const { x: x2, y: y2 } = point2;
              const distance=calculateDistance(x1,y1,x2,y2)*mul;
              // if(u===9 && v===15){
              //   const h2=y2+distance+coord;
              //   const l2=x2+coord;
              //   const l1=x1+coord;
              //   const h1=y1+coord;
              //   const midx=((l1+l2)/2)+(0.75*mul)
              //   const midy=(h1+h2)/2;
              //   doc.moveTo(l1,h1).quadraticCurveTo(midx,midy,l2,h2).stroke();
              // }
              if (u===15 && v===14){
                const l2=x2+coord;
                const h2=y2+coord+distance;
                const l1=x1+coord;
                const h1=y1+coord;
                const midx=(l1+l2)/2
                const midy=(h1+h2)/2
                doc.moveTo(l1,h1).lineTo(midx,midy/2).stroke();
              }
              console.log(`${u}, ${v} distance is`,calculateDistance(x1,y1,x2,y2))
        }
        doc.end();
    });
};




const FetchFormulaeController = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, data) => {
    if (err) {
      return res.status(404).json(err);
    }
    const userId= data.id;
      try {
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role ==="admin"){
        const formulas = await Formula.find();
        res.status(200).json(formulas);
      }
    } catch (error) {
      res.status(500).json({ message: "Not authorized to fetch formulae" });
    }
  });
});

// Update Formula Controller
const UpdateFormulaController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { key, expression } = req.body;

  try {
    // Check if the user is an admin
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the formula by id
    let formula = await Formula.findById(id);
    if (!formula) {
      return res.status(404).json({ message: "Formula not found" });
    }

    // Update the formula fields
    formula.key = key;
    formula.expression = expression;

    // Save the updated formula
    await formula.save();

    res.status(200).json({ message: "Formula updated successfully", formula });
  } catch (error) {
    console.error("Error updating formula:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});



// Delete Formula Controller
const DeleteFormulaController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the user is an admin
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the formula by id
    let formula = await Formula.findById(id);
    if (!formula) {
      return res.status(404).json({ message: "Formula not found" });
    }

    // Delete the formula
    await formula.remove();

    res.status(200).json({ message: "Formula deleted successfully" });
  } catch (error) {
    console.error("Error deleting formula:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});
module.exports = { TrouserCalculation , FetchFormulaeController ,DeleteFormulaController,UpdateFormulaController,generatePDF};
