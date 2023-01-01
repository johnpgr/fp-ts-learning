import * as Opt from "fp-ts/lib/Option.js";
import { pipe } from "fp-ts/lib/function.js";
import { Option } from "fp-ts/lib/Option.js";

export function part1(input: Option<string>): number {
    return pipe(
        input,
        parseInput,
        calculateDifference,
        countIncreases,
        Opt.getOrElse(() => 0)
    );
}

export function part2(input: Option<string>): number {
    return pipe(
        input,
        parseInput,
        toThreeSum,
        calculateDifference,
        countIncreases,
        Opt.getOrElse(() => 0)
    );
}

function parseInput(input: Option<string>): Option<number[]> {
    return pipe(
        input,
        Opt.map((input) => input.split("\n")),
        Opt.map((input) => input.map((x) => parseInt(x)))
    );
}

//create an array of sums of each number with it's next two numbers
function toThreeSum(input: Option<number[]>): Option<number[]> {
    return pipe(
        input,
        Opt.chain((input) =>
            Opt.fromNullable(
                input
                    .map((x, i, arr) => x + arr[i + 1] + arr[i + 2])
                    .filter((x) => !isNaN(x))
            )
        )
    );
}

function calculateDifference(input: Option<number[]>): Option<number[]> {
    return pipe(
        input,
        Opt.map((input) => input.map((x, i, arr) => arr[i + 1] - x))
    );
}

function countIncreases(input: Option<number[]>): Option<number> {
    return pipe(
        input,
        Opt.map((input) => input.reduce((acc, x) => acc + (x > 0 ? 1 : 0), 0))
    );
}
