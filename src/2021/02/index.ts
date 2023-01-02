import { pipe } from "fp-ts/lib/function.js";
import { Option } from "fp-ts/lib/Option.js";
import * as Opt from "fp-ts/lib/Option.js";

export const part1 = (input: Option<string>): number => {
    return pipe(
        input,
        parseInput,
        calculatePosition,
        Opt.getOrElse(() => 0)
    );
};

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
                forward: input.reduce(
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
            console.log({ depth: input.depth, forward: input.forward });
            return input.depth * input.forward;
        })
    );
}
