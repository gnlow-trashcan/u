type Expression<Name extends string = string> =
    | { type: "variable"; name: Name extends `${infer T}` ? T : never }
    | { type: "constant"; name: Name; value: any ; }
    | { type: "function"; name: Name; args: Expression[] }

type Substitution<T extends Expression> = {
    [P in T["name"]]: T extends { type: "variable"; name: P } ? Expression : never
}

type Unify<X extends Expression, Y extends Expression> =
    X extends Y
        ? Substitution<X>
    : Y extends X
        ? Substitution<Y>
    : X extends { type: "variable" }
        ? Substitution<X> & { [P in X["name"]]: Y }
    : Y extends { type: "variable" }
        ? Substitution<Y> & { [P in Y["name"]]: X }
    : X extends { type: "constant"; value: infer V }
        ? Y extends { type: "constant"; value: V }
            ? Substitution<X>
            : never
    : Y extends { type: "constant"; value: infer V }
        ? X extends { type: "constant"; value: V }
            ? Substitution<Y>
            : never
    : X extends { type: "function"; name: infer N; args: infer A extends Expression[] }
        ? Y extends { type: "function"; name: N; args: infer B extends Expression[] }
            ? A extends B
                ? Substitution<X> & UnifyAll<A, B>
                : never
            : never
    : Y extends { type: "function"; name: infer N; args: infer B extends Expression[] }
        ? X extends { type: "function"; name: N; args: infer A extends Expression[] }
            ? B extends A
                ? Substitution<Y> & UnifyAll<A, B>
                : never
            : never
    : never

type UnifyAllRecursive<A extends Expression[], B extends Expression[], I extends keyof A & number = keyof A & number> =
    I extends keyof B ? Unify<A[I], B[I]> : never
    | UnifyAllRecursive<A, B, Exclude<I, keyof A>>
  
type UnifyAll<A extends Expression[], B extends Expression[]> = 
    //UnifyAllRecursive<A, B>
    | Unify<A[0], B[0]>
    | Unify<A[1], B[1]>
    | Unify<A[2], B[2]>

function unify<X extends Expression, Y extends Expression>(
    x: X,
    y: Y
): Unify<X, Y> {
    return {} as any // The implementation is not relevant for this example
}

const x = { type: "variable", name: "x" as const }
const y = { type: "variable", name: "y" as const }
const z = { type: "variable", name: "z" as const }
const a = { type: "constant", name: "a" as const, value: "a" }
const b = { type: "constant", name: "b" as const, value: "b" }
const f = { type: "function", name: "f" as const, args: [x, y] }
const g = { type: "function", name: "g" as const, args: [a, b] }

type Test1 = Unify<typeof x, typeof a> // { x: Expression }
type Test2 = Unify<typeof f, typeof g> // { x: Expression, y: Expression }
type Test3 = Unify<typeof f, { type: "function", name: "f", args: [typeof x, typeof z] }> // { x: Expression, y: Expression }

