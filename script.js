function runNeedlemanWunsch() {
  const sequence1Raw = document.getElementById("sequence1").value.toUpperCase();
  const sequence2Raw = document.getElementById("sequence2").value.toUpperCase();
  const match = parseInt(document.getElementById("match").value, 10);
  const mismatch = parseInt(document.getElementById("mismatch").value, 10);
  const gap = parseInt(document.getElementById("gap").value, 10);

  
  if (isNaN(match) || isNaN(mismatch) || isNaN(gap)) {
    document.getElementById("result").innerHTML = "Please enter valid scoring values.";
    return;
  }

  
  const allowedChars = "ACGTN";

  function cleanSequence(seq) {
    
    seq = seq.replace(/^>.*\n?/gm, "").replace(/\s+/g, "").toUpperCase();

    
    const invalid = seq.replace(new RegExp(`[${allowedChars}]`, "g"), "");
    if (invalid.length > 0) {
      document.getElementById("result").innerHTML =
        `Invalid characters found: ${[...new Set(invalid)].join(", ")}`;
      throw new Error("Invalid sequence input.");
    }
    return seq;
  }

  let sequence1, sequence2;
  try {
    sequence1 = cleanSequence(sequence1Raw);
    sequence2 = cleanSequence(sequence2Raw);
  } catch {
    return; 
  }

  // Run alignment
  const result = needlemanWunsch(sequence1, sequence2, match, mismatch, gap);
  document.getElementById("result").innerHTML = result;
}

function needlemanWunsch(seq1, seq2, match, mismatch, gap) {
  const matrix = [];

  
  for (let i = 0; i <= seq1.length; i++) {
    matrix[i] = [];
    for (let j = 0; j <= seq2.length; j++) {
      if (i === 0 && j === 0) {
        matrix[i][j] = 0;
      } else if (i === 0) {
        matrix[i][j] = matrix[i][j - 1] + gap;
      } else if (j === 0) {
        matrix[i][j] = matrix[i - 1][j] + gap;
      } else {
        const score = seq1[i - 1] === seq2[j - 1] ? match : mismatch;
        matrix[i][j] = Math.max(
          matrix[i - 1][j - 1] + score,
          matrix[i - 1][j] + gap,
          matrix[i][j - 1] + gap
        );
      }
    }
  }

  
  let alignment1 = "";
  let alignment2 = "";
  let i = seq1.length;
  let j = seq2.length;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      matrix[i][j] === matrix[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? match : mismatch)
    ) {
      alignment1 = seq1[i - 1] + alignment1;
      alignment2 = seq2[j - 1] + alignment2;
      i--;
      j--;
    } else if (i > 0 && matrix[i][j] === matrix[i - 1][j] + gap) {
      alignment1 = seq1[i - 1] + alignment1;
      alignment2 = "-" + alignment2;
      i--;
    } else {
      alignment1 = "-" + alignment1;
      alignment2 = seq2[j - 1] + alignment2;
      j--;
    }
  }

  return `<pre>Alignment 1: ${alignment1}\nAlignment 2: ${alignment2}</pre>`;
}
