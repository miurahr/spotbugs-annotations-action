#!/usr/bin/env node
/*
 * Copyright (C) 2021 Kian Cross
 *               2023 Hiroshi Miura
 */

const fs = require("fs");

function invertObject(object) {
  return Object.entries(object)
    .reduce((t, [key, value]) => {
      t[value] = key;
      return t;
    }, {});
}

function assertEqual(a, b) {
  if (a !== b) {
    throw new Error(`Expected "${a}" == "${b}"`);
  }
}

const testCases = [
  {
    input: `2023-09-23T04:41:35.2692129Z L B NM_CONFUSING Nm: Confusing to have methods org.omegat.externalfinder.item.ExternalFinderItem.getKeystroke() and org.omegat.externalfinder.item.ExternalFinderItem$Builder.getKeyStroke()  At ExternalFinderItem.java:[line 107]`,
    severity: "ERROR",
    file: "ExternalFinderItem.java",
    line: "107",
    message: `Confusing to have methods org.omegat.externalfinder.item.ExternalFinderItem.getKeystroke() and org.omegat.externalfinder.item.ExternalFinderItem$Builder.getKeyStroke() `,
    code: "B NM_CONFUSING Nm",
  }, {
    input: `2023-09-23T04:41:35.2677654Z M V EI_EXPOSE_REP2 EI2: new org.omegat.core.threads.SearchThread(SearchWindowController, Searcher) may expose internal representation by storing an externally mutable object into SearchThread.window  At SearchThread.java:[line 67]`,
    severity: "ERROR",
    file: "SearchThread.java",
    line: "67",
    message: `new org.omegat.core.threads.SearchThread(SearchWindowController, Searcher) may expose internal representation by storing an externally mutable object into SearchThread.window `,
    code: "V EI_EXPOSE_REP2 EI2",
  }
];

const root = JSON.parse(fs.readFileSync("problem-matcher.json"));
const matcher = root.problemMatcher[0].pattern[0];
const regexp = new RegExp(matcher.regexp);
const invertedObject = invertObject(matcher);

for (const testCase of testCases) {
  const matches = testCase.input.match(regexp);

  for (let i = 1; i <= 5; i++) {
    const fieldName = invertedObject[i];
    assertEqual(testCase[fieldName], matches[i]);
  }
}

console.log("All tests passed");
