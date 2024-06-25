import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  nodeResolve: true,
  files: ["test/**/*.js"],
  coverageConfig: {
    report: true,
    reportDir: "coverage",
    threshold: {
      statements: 99,
      branches: 96,
      functions: 100,
      lines: 99,
    },
  },
  browsers: [
    playwrightLauncher({
      product: "chromium",
    }),
  ],
};
