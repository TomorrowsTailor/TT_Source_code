const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Formula = require("../model/Formula");
const math = require("mathjs");
const PDFDocument = require('pdfkit');
// const svgToPdf = require('svg-to-pdfkit');
const fs = require('fs');
// const redis=require("redis");
// const client= redis.createClient();


// const getStateData = () => {
//     client.get('filteredPoints', (err1, filteredPointsData) => {
//         if (err1) {
//             console.error('Error getting filtered points from cache:', err1);
//             return err1;
//         }
//     client.get('filteredBackviewPoints', (err2, filteredBackviewPointsData) => {
//         if (err2) {
//             console.error('Error getting filtered backview points from cache:', err2);
//             return err2;
//         }
//     client.get('filteredGridviewPoints', (err3, filteredGridviewPointsData) => {
//         if (err3) {
//             console.error('Error getting filtered gridview points from cache:', err3);
//             return err3;
//         }
//         const data = {
//             filteredPoints: JSON.parse(filteredPointsData),
//             filteredBackviewPoints: JSON.parse(filteredBackviewPointsData),
//             filteredGridviewPoints: JSON.parse(filteredGridviewPointsData),
//         };
//         console.log("data from redis",data)
//             });
//         });
//     });
// };









// module.exports = { generatePDF};