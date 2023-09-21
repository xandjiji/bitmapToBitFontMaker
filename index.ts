import fs from "fs";
import { createCanvas, loadImage } from "canvas";

const imgSrc = "./verdana-11px-monochrome_cp1252.png";

const img = await loadImage(fs.readFileSync(imgSrc));

const DIMENSION = 16;

const canvas = createCanvas(img.width, img.height);
const ctx = canvas.getContext("2d");

ctx.drawImage(img, 0, 0);

const BASE_ASCII_INDEX = 32;

const data: any = {
  name: "",
  copy: "",
  letterspace: "64",
  basefont_size: "512",
  basefont_left: "62",
  basefont_top: "0",
  basefont: "Arial",
  basefont2: "",
};

let charCount = 0;

for (let charY = 0; charY < img.height / DIMENSION; charY++) {
  const charOffsetY = charY * DIMENSION;
  for (let charX = 0; charX < img.width / DIMENSION; charX++) {
    const charOffsetX = charX * DIMENSION;

    const currentChar: number[] = [];

    for (let i = 0; i < DIMENSION; i++) {
      currentChar.push(0);
    }

    for (let x = 0; x < DIMENSION; x++) {
      for (let y = 0; y < DIMENSION; y++) {
        const pixelData = ctx.getImageData(
          charOffsetX + x,
          charOffsetY + y,
          1,
          1
        ).data;

        const isPainted = pixelData[0] > 0;

        if (isPainted) {
          currentChar[y] += 2 ** x;
        }
      }
    }

    data[BASE_ASCII_INDEX + charCount] = currentChar;
    charCount++;
  }
}

console.log(JSON.stringify(data));
