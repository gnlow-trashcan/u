type Expression =
    | { type: "variable"; name: string }
    | { type: "constant"; value: any }
    | { type: "function"; name: string; args: Expression[] }

function unify(
    x: Expression,
    y: Expression,
    substitution: { [name: string]: Expression } = {},
): { [name: string]: Expression } | null {
    if (x.type === "variable") {
        // If x is a variable, add it to the substitution if it is not already there
        if (!(x.name in substitution)) {
            substitution[x.name] = y
        } else {
            // If x is already in the substitution, unify it with the value in the substitution
            return unify(substitution[x.name], y, substitution)
        }
    } else if (y.type === "variable") {
        // If y is a variable and x is not, swap x and y and try again
        return unify(y, x, substitution)
    } else if (x.type === "constant" && y.type === "constant") {
        // If both x and y are constants, they must be equal
        if (x.value !== y.value) return null
    } else if (x.type === "function" && y.type === "function") {
        // If both x and y are function calls, they must have the same name and the same number of arguments
        if (x.name !== y.name || x.args.length !== y.args.length) return null
        // Unify the arguments of the function calls
        for (let i = 0; i < x.args.length; i++) {
            const sub = unify(x.args[i], y.args[i], substitution)
            if (sub === null) return null
            substitution = sub
        }
    } else {
        // If x and y have different types, they cannot be unified
        return null
    }
    // If we reach this point, the expressions have been unified successfully
    return substitution
}

const x: Expression = { type: "variable", name: "x" }
const y: Expression = { type: "variable", name: "y" }
const z: Expression = { type: "variable", name: "z" }
const a: Expression = { type: "constant", value: "a" }
const b: Expression = { type: "constant", value: "b" }
const f: Expression = { type: "function", name: "f", args: [x, y] }
const g: Expression = { type: "function", name: "g", args: [a, b] }

console.log(unify(x, a)) // { x: { type: "constant", value: "a" } }
console.log(unify(f, g)) // { x: { type: "constant", value: "a" }, y: { type: "constant", value: "b" } }
console.log(unify(f, { type: "function", name: "f", args: [x, z] })) // { x: { type: "variable", name: "z" }, y: { type: "variable", name: "z" } }
console.log(unify(f, { type: "function", name: "g", args: [x, y] })) // null
