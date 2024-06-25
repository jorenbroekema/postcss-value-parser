import { expect } from "chai";
import parser from "../lib/index.js";

describe("ValueParser", function () {
  it("should do i/o", () => {
    const tests = [
      " rgba( 34 , 45 , 54, .5 ) ",
      "w1 w2 w6 \n f(4) ( ) () \t \"s't\" 'st\\\"2'",
    ];

    tests.forEach(function (item) {
      const parsed = parser(item)
        .walk(function () {})
        .toString();

      expect(parsed).to.equal(item);
    });
  });

  it("should walk", () => {
    let result;

    result = [];

    parser("fn( ) fn2( fn3())").walk(function (node) {
      if (node.type === "function") {
        result.push(node);
      }
    });

    // should process all functions
    expect(result).to.eql([
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 5,
        value: "fn",
        before: " ",
        after: "",
        nodes: [],
      },
      {
        type: "function",
        sourceIndex: 6,
        sourceEndIndex: 17,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 11,
            sourceEndIndex: 16,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
      {
        type: "function",
        sourceIndex: 11,
        sourceEndIndex: 16,
        value: "fn3",
        before: "",
        after: "",
        nodes: [],
      },
    ]);

    result = [];

    parser("fn( ) fn2( fn3())").walk(function (node) {
      if (node.type === "function") {
        result.push(node);
        if (node.value === "fn2") {
          return false;
        }
      }
      return true;
    });

    // shouldn't process functions after falsy callback
    expect(result).to.eql([
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 5,
        value: "fn",
        before: " ",
        after: "",
        nodes: [],
      },
      {
        type: "function",
        sourceIndex: 6,
        sourceEndIndex: 17,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 11,
            sourceEndIndex: 16,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
    ]);

    result = [];

    parser("fn( ) fn2( fn3())").walk(function (node) {
      if (node.type === "function" && node.value === "fn2") {
        node.type = "word";
      }
      result.push(node);
    });

    // shouldn't process nodes with defined non-function type
    expect(result).to.eql([
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 5,
        value: "fn",
        before: " ",
        after: "",
        nodes: [],
      },
      { type: "space", sourceIndex: 5, sourceEndIndex: 6, value: " " },
      {
        type: "word",
        sourceIndex: 6,
        sourceEndIndex: 17,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 11,
            sourceEndIndex: 16,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
    ]);

    result = [];

    parser("fn2( fn3())").walk(function (node) {
      if (node.type === "function") {
        result.push(node);
      }
    }, true);

    // should process all functions with reverse mode
    expect(result).to.eql([
      {
        type: "function",
        sourceIndex: 5,
        sourceEndIndex: 10,
        value: "fn3",
        before: "",
        after: "",
        nodes: [],
      },
      {
        type: "function",
        sourceIndex: 0,
        sourceEndIndex: 11,
        value: "fn2",
        before: " ",
        after: "",
        nodes: [
          {
            type: "function",
            sourceIndex: 5,
            sourceEndIndex: 10,
            value: "fn3",
            before: "",
            after: "",
            nodes: [],
          },
        ],
      },
    ]);
  });
});
