import csv from 'csvtojson';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

pipeline(
    createReadStream('./csv/nodejs-hw1-ex1.csv'),
    csv(),
    createWriteStream('./csv/nodejs-hw1-ex1.txt'),
    err => {
        if (err) {
            console.error(err);
        } else {
            console.log('File converted')
        }
    }
)

