import { expect } from "chai";
import parse from "../lib/parse.js";
import stringify from "../lib/stringify.js";

const tests = [
  {
    message: "Should correctly add quotes",
    fixture:
      "bold italic 12px/3 'Open Sans', Arial, \"Helvetica Neue\", sans-serif",
  },
  {
    message: "Should not close unclosed strings",
    fixture: '" 12,  54, 65 ',
  },
  {
    message: "Should correctly add brackets",
    fixture: " rgba( 12,  54, 65) ",
  },
  {
    message: "Should not close unclosed functions",
    fixture: " rgba( 12,  54, 65 ",
  },
  {
    message: "Should correctly process advanced gradients",
    fixture:
      "background-image:linear-gradient(45deg,transparent 25%,hsla(0,0%,100%,.2) 25%,hsla(0,0%,100%,.2) 75%,transparent 75%,transparent 25%,hsla(0,0%,100%,.2) 75%,transparent 75%,transparent),linear-gradient(45deg,transparent 25%,hsla(0,0%,100%,.2))",
  },
  {
    message: "Should correctly add comments",
    fixture: "/!*comment*!/ 1px /!* unclosed ",
  },
  {
    message: "Should correctly process comments inside functions",
    fixture:
      "/!*before*!/ rgb( /!*red component*!/ 12,  54 /!*green component*!/, /!* blue *!/ 65)/!* after *!/ ",
  },
  {
    message: "Should correctly process empty url",
    fixture: "url()",
  },
  {
    message: "Should correctly process empty url with space",
    fixture: "url( )",
  },
  {
    message: "Should correctly process empty url with spaces",
    fixture: "url(   )",
  },
  {
    message: "Should correctly process empty url with tab",
    fixture: "url(\t)",
  },
  {
    message: "Should correctly process empty url with newline (LF)",
    fixture: "url(\n)",
  },
  {
    message: "Should correctly process empty url with newline (LF)",
    fixture: "url(\n\n\n)",
  },
  {
    message: "Should correctly process empty url with multiple newlines (CRLF)",
    fixture: "url(\r\n)",
  },
  {
    message: "Should correctly process empty url with multiple newlines (CRLF)",
    fixture: "url(\r\n\r\n\r\n)",
  },
  {
    message: "Should correctly process empty url whitespace characters",
    fixture: "url(  \n \t  \n  )",
  },
  {
    message: "Should correctly process unicode-range (single codepoint)",
    fixture: "U+26",
  },
  {
    message: "Should correctly process unicode-range (codepoint range)",
    fixture: "U+0025-00FF",
  },
  {
    message: "Should correctly process unicode-range (wildcard range)",
    fixture: "U+4??",
  },
  {
    message: "Should correctly process unicode-range (multiple values)",
    fixture: "U+0025-00FF, U+4??",
  },
];

describe("Stringify", function () {
  it("should stringify properly", () => {
    tests.forEach(function (opts) {
      expect(stringify(parse(opts.fixture))).to.equal(opts.fixture);
    });

    const tokens = parse(" rgba(12,  54, 65 ) ");

    expect(
      stringify(tokens, function (node) {
        if (node.type === "function") {
          return (
            node.value +
            "[" +
            [
              node.nodes[0].value,
              node.nodes[2].value,
              node.nodes[4].value,
            ].join(",") +
            "]"
          );
        }
      }),
    ).to.equal(" rgba[12,54,65] ");

    expect(
      stringify(tokens[1], function (node) {
        if (node.type === "function") {
          return (
            node.value +
            "[" +
            [
              node.nodes[0].value,
              node.nodes[2].value,
              node.nodes[4].value,
            ].join(",") +
            "]"
          );
        }
      }),
    ).to.equal("rgba[12,54,65]");

    tokens[1].type = "word";

    expect(stringify(tokens)).to.equal(" rgba ");

    expect(
      stringify(parse("calc(1px + var(--bar))"), function (node) {
        if (node.type === "function" && node.value === "var") {
          return "10px";
        }
      }),
    ).to.equal("calc(1px + 10px)");
  });
});
