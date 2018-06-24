// @flow
import type { ContentBlock } from 'draft-js'

type StrategyCallback = (start:number, end:number) => void

const findWithRegex = (regex: RegExp, contentBlock: ContentBlock, callback: StrategyCallback): void => {
  // Get the text from the contentBlock
  const text = contentBlock.getText();
  let matchArr;
  let start; // eslint-disable-line
  // Go through all matches in the text and return the indizes to the callback
  while ((matchArr = regex.exec(text)) !== null) { // eslint-disable-line
    if (matchArr.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
};

export default findWithRegex;
