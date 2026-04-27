// ================= RM from SSIM =================
export function calculateRMFromSSIM(grid) {
  const n = grid.length - 1;

  let rm = Array.from({ length: n }, () => Array(n).fill(0));

  // diagonal = 1
  for (let i = 0; i < n; i++) {
    rm[i][i] = 1;
  }

  for (let i = 1; i <= n; i++) {
    for (let j = i + 1; j <= n; j++) {
      let val = grid[i][j].trim().toUpperCase();

      if (val === "V") {
        rm[i - 1][j - 1] = 1;
        rm[j - 1][i - 1] = 0;
      } else if (val === "A") {
        rm[i - 1][j - 1] = 0;
        rm[j - 1][i - 1] = 1;
      } else if (val === "X") {
        rm[i - 1][j - 1] = 1;
        rm[j - 1][i - 1] = 1;
      } else {
        rm[i - 1][j - 1] = 0;
        rm[j - 1][i - 1] = 0;
      }
    }
  }

  const driving_power = rm.map(row =>
    row.reduce((a, b) => a + b, 0)
  );

  const dependence_power = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      dependence_power[j] += rm[i][j];
    }
  }

  return { rm, driving_power, dependence_power };
}


// ================= FRM =================
export function calculateFRM(rm) {
  const n = rm.length;
  let frm = rm.map(row => [...row]);

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (frm[i][j] === 1 || (frm[i][k] === 1 && frm[k][j] === 1)) {
          frm[i][j] = 1;
        }
      }
    }
  }

  const driving_power = frm.map(row =>
    row.reduce((a, b) => a + b, 0)
  );

  const dependence_power = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      dependence_power[j] += frm[i][j];
    }
  }

  return { frm, driving_power, dependence_power };
}


// ================= LEVEL PARTITION =================
export function calculateLevelPartition(frm, variables) {
  const n = frm.length;

  let remaining = new Set([...Array(n).keys()]);
  let level = 1;
  let elements = [];

  while (remaining.size > 0) {
    let currentLevel = [];

    for (let i of remaining) {
      let reachability = new Set(
        [...remaining].filter(j => frm[i][j] === 1)
      );

      let antecedent = new Set(
        [...remaining].filter(j => frm[j][i] === 1)
      );

      let intersection = new Set(
        [...reachability].filter(x => antecedent.has(x))
      );

      if (
        reachability.size === intersection.size &&
        [...reachability].every(x => intersection.has(x))
      ) {
        currentLevel.push(i);
      }
    }

    if (currentLevel.length === 0) break;

    for (let i of currentLevel) {
      let reachability = [...remaining]
        .filter(j => frm[i][j] === 1)
        .map(j => variables[j]);

      let antecedent = [...remaining]
        .filter(j => frm[j][i] === 1)
        .map(j => variables[j]);

      let intersection = reachability.filter(x =>
        antecedent.includes(x)
      );

      elements.push({
        element: variables[i],
        reachability,
        antecedent,
        intersection,
        level
      });
    }

    currentLevel.forEach(i => remaining.delete(i));
    level++;
  }

  return elements;
}


// ================= CONICAL + REDUCED =================
export function generateConicalAndReduced(frm, elements) {
  let levelMap = {};

  elements.forEach(e => {
    if (!levelMap[e.level]) levelMap[e.level] = [];
    levelMap[e.level].push(e.element);
  });

  let ordered = [];
  Object.keys(levelMap)
    .sort((a, b) => a - b)
    .forEach(l => ordered.push(...levelMap[l]));

  let originalVars = elements.map(e => e.element);
  let indexMap = {};
  originalVars.forEach((v, i) => (indexMap[v] = i));

  let order = ordered.map(v => indexMap[v]);

  let conical = order.map(i =>
    order.map(j => frm[i][j])
  );

  let n = conical.length;
  let reduced = conical.map(row => [...row]);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && reduced[i][j] === 1) {
        reduced[i][j] = 0;

        let stack = [i];
        let visited = new Set();
        let found = false;

        while (stack.length) {
          let node = stack.pop();
          if (node === j) {
            found = true;
            break;
          }

          for (let k = 0; k < n; k++) {
            if (reduced[node][k] === 1 && !visited.has(k)) {
              visited.add(k);
              stack.push(k);
            }
          }
        }

        if (!found) reduced[i][j] = 1;
      }
    }
  }

  return {
    conical,
    reduced,
    ordered_variables: ordered
  };
}