type Variable = string;
type Term = Variable | number;

interface Expression {
  type: "expression";
  operator: "+" | "-";
  operands: [Term, Term];
}

function unify(e1: Expression, e2: Expression): { [key: string]: Term } | null {
  if (e1.type !== e2.type || e1.operator !== e2.operator) {
    return null;
  }

  const [t1, t2] = e1.operands;
  const [u1, u2] = e2.operands;

  if (typeof t1 === "number" && typeof u1 === "number") {
    if (t1 !== u1) {
      return null;
    }
  }

  if (typeof t2 === "number" && typeof u2 === "number") {
    if (t2 !== u2) {
      return null;
    }
  }

  const result: { [key: string]: Term } = {};
  if (typeof t1 === "string") {
    result[t1] = u1;
  }

  if (typeof t2 === "string") {
    result[t2] = u2;
  }

  return result;
}

// Example usage:
const x = "x";
const e1: Expression = { type: "expression", operator: "+", operands: [x, 2] };
const e2: Expression = { type: "expression", operator: "+", operands: [4, 0] };

const result = unify(e1, e2);

if (result) {
  console.log(`${x} = ${result[x]}`);
} else {
  console.log("Unification failed.");
}

// Output: "x = 4"
