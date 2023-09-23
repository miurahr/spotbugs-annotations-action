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
    input: `2023-09-23T04:41:35.2692129Z L B NM_CONFUSING Nm: Confusing to have methods org.omegat.externalfinder.item.ExternalFinderItem.getKeystroke() and org.omegat.externalfinder.item.ExternalFinderItem$Builder.getKeyStroke()  At ExternalFinderItem.java:[line 107-108]`,
    file: "ExternalFinderItem.java",
    line: "107-108",
    message: `Confusing to have methods org.omegat.externalfinder.item.ExternalFinderItem.getKeystroke() and org.omegat.externalfinder.item.ExternalFinderItem$Builder.getKeyStroke() `,
    code: "L B NM_CONFUSING Nm",
    pat: 0
  }, {
    input: `2023-09-23T04:41:35.2677654Z M V EI_EXPOSE_REP2 EI2: new org.omegat.core.threads.SearchThread(SearchWindowController, Searcher) may expose internal representation by storing an externally mutable object into SearchThread.window  At SearchThread.java:[line 67]`,
    file: "SearchThread.java",
    line: "67",
    message: `new org.omegat.core.threads.SearchThread(SearchWindowController, Searcher) may expose internal representation by storing an externally mutable object into SearchThread.window `,
    code: "M V EI_EXPOSE_REP2 EI2",
    pat: 0
  }, {
    input: `2023-09-23T04:41:35.2690754Z L B SE_BAD_FIELD Se: Class org.omegat.externalfinder.gui.ExternalFinderPreferencesController$ItemsTableModel defines non-transient non-serializable instance field data  In ExternalFinderPreferencesController.java`,
    file: "ExternalFinderPreferencesController.java",
    message: `Class org.omegat.externalfinder.gui.ExternalFinderPreferencesController$ItemsTableModel defines non-transient non-serializable instance field data `,
    code: "L B SE_BAD_FIELD Se",
    pat: 2
  }, {
    input: `2023-09-23T04:41:35.3002703Z M X OBL_UNSATISFIED_OBLIGATION OBL: new org.omegat.filters3.xml.XMLReader(File, String) may fail to clean up java.io.InputStream  Obligation to clean up resource created at XMLReader.java:[line 112] is not discharged`,
    file: "XMLReader.java",
    line: "112",
    message: `new org.omegat.filters3.xml.XMLReader(File, String) may fail to clean up java.io.InputStream  Obligation to clean up resource created at XMLReader.java:[line 112] is not discharged`,
    code: "M X OBL_UNSATISFIED_OBLIGATION OBL",
    pat: 1
  }

];

const root = JSON.parse(fs.readFileSync("problem-matcher.json"));

for (const testCase of testCases) {
  const pat = testCase["pat"]
  const matcher = root.problemMatcher[0].pattern[pat];
  const regexp = new RegExp(matcher.regexp);
  const invertedObject = invertObject(matcher);
  const matches = testCase.input.match(regexp);

  for (let i = 1; i <= 5; i++) {
    const fieldName = invertedObject[i];
    assertEqual(testCase[fieldName], matches[i]);
  }
}

console.log("All tests passed");
