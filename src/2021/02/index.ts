import { pipe } from "fp-ts/lib/function.js";
import { Option } from "fp-ts/lib/Option.js";
import * as Opt from "fp-ts/lib/Option.js";
import * as Arr from "fp-ts/lib/Array.js";

export function part1(input: Option<string>): number {
    return pipe(
        input,
        parseInput,
        calculatePosition,
        Opt.getOrElse(() => 0)
    );
}

export function part2(input: Option<string>): number {
    return pipe(
        input,
        parseInput,
        calculatePositionPt2,
        Opt.getOrElse(() => 0)
    );
}

export type Instruction = {
    readonly _type: "forward" | "depth";
    readonly value: number;
};

function parseInput(input: Option<string>): Option<Instruction[]> {
    return pipe(
        input,
        Opt.map((input) => input.split("\n")),
        Opt.map((input) =>
            input.map((line) =>
                line.startsWith("forward")
                    ? { _type: "forward", value: parseInt(line.split(" ")[1]) }
                    : {
                          _type: "depth",
                          value: line.startsWith("up")
                              ? parseInt(line.split(" ")[1]) * -1
                              : parseInt(line.split(" ")[1]),
                      }
            )
        )
    );
}

function calculatePosition(input: Option<Instruction[]>): Option<number> {
    return pipe(
        input,
        Opt.map((input) => {
            return {
                horizontal: input.reduce(
                    (acc, curr) =>
                        curr._type === "forward" ? acc + curr.value : acc,
                    0
                ),
                depth: input.reduce(
                    (acc, curr) =>
                        curr._type === "depth" ? acc + curr.value : acc,
                    0
                ),
            };
        }),
        Opt.map((input) => {
            return input.depth * input.horizontal;
        })
    );
}

function calculatePositionPt2(input: Option<Instruction[]>): Option<number> {
    return pipe(
        input,
        Opt.map((input) =>
            input.map((instruction, i, instructions) => {
                return {
                    forward:
                        instruction._type === "forward" ? instruction.value : 0,
                    aim: pipe(
                        Arr.findLastIndex(
                            (ins: Instruction) => ins._type === "depth"
                        )(instructions.slice(0, i + 1)),
                        Opt.map((i) => {
                            return {
                                i,
                                value: instructions[i].value,
                            };
                        }),
                        Opt.getOrElse(() => {
                            return { i: 0, value: 0 };
                        })
                    ),
                };
            })
        ),
        Opt.map((input) => {
            return input.reduce(
                (acc, curr) => {
                    console.log({
                        forward: curr.forward,
                        aim: {
                            value:
                                curr.aim.i !== acc.aim.i
                                    ? curr.aim.value + acc.aim.value
                                    : curr.aim.value,
                            i: curr.aim.i,
                        },
                        horizontal: curr.forward + acc.horizontal,
                        depth: acc.depth + curr.aim.value * curr.forward,
                    });
                    return {
                        horizontal: curr.forward + acc.horizontal,
                        aim: {
                            value:
                                curr.aim.i !== acc.aim.i
                                    ? curr.aim.value + acc.aim.value
                                    : curr.aim.value,
                            i: curr.aim.i,
                        },
                        depth: acc.depth + curr.aim.value * curr.forward,
                    };
                },
                { horizontal: 0, aim: { i: 0, value: 0 }, depth: 0 }
            );
        }),
        Opt.map((input) => input.depth * input.horizontal)
    );
}
