import fs from "node:fs";
import { tryCatch } from "fp-ts/lib/Option.js";

// const input = tryCatch(() => fs.readFileSync("src/2021/01/input.txt", "utf-8"));
// const testInput = tryCatch(() =>
//     fs.readFileSync("src/2021/01/input_test.txt", "utf-8")
// );
// import { part1, part2 } from "./2021/01/index.js";
// console.log("day 1, part 1 test input:\t",part1(testInput));
// console.log("day 1, part 1 real input:\t",part1(input));
// console.log("day 1, part 2 test input:\t", part2(testInput));
// console.log("day 1, part 2 real input:\t", part2(input));

const input = tryCatch(() => fs.readFileSync("src/2021/02/input.txt", "utf-8"));
const testInput = tryCatch(() =>
    fs.readFileSync("src/2021/02/input_test.txt", "utf-8")
);
import { part1, part2 } from "./2021/02/index.js";
console.log("day 2, part 1 test input:\t", part1(testInput));
console.log("day 2, part 1 real input:\t", part1(input));
console.log("day 2, part 2 test input:\t", part2(testInput));
console.log("day 2, part 2 real input: \t", part2(input));
