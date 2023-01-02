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
        parseSteps,
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

export type Step = {
    readonly currInstruction: Instruction;
    currHorizontal: number;
    currDepth: number;
    currAim: number;
};

function parseSteps(instructions: Option<Instruction[]>): Option<number> {
    return pipe(
        instructions,
        Opt.map((instr) => {
            return instr.reduce(
                (acc, curr) => {
                    const currAim =
                        curr._type === "depth"
                            ? acc.currAim + curr.value
                            : acc.currAim;
                    const currDepth =
                        curr._type === "forward"
                            ? acc.currDepth + curr.value * currAim
                            : acc.currDepth;
                    const currHorizontal =
                        curr._type === "forward"
                            ? acc.currHorizontal + curr.value
                            : acc.currHorizontal;
                    // console.log({
                    //     curr,
                    //     currAim,
                    //     currDepth,
                    //     currHorizontal,
                    // });
                    return {
                        currAim,
                        currDepth,
                        currHorizontal,
                    };
                },
                {
                    currAim: 0,
                    currDepth: 0,
                    currHorizontal: 0,
                }
            );
        }),
        Opt.map((steps) => steps.currDepth * steps.currHorizontal)
    );
}
