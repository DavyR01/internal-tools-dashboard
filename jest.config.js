import nextJest from "next/jest";

const createJestConfig = nextJest({
   dir: "./",
});

const customJestConfig = {
   testEnvironment: "jest-environment-jsdom",
   setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
   moduleDirectories: ["node_modules", "<rootDir>/"],
   testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],

   // alias TS du type "@/..."
   moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/$1",
      // CSS modules + global CSS
      "\\.(css|less|sass|scss)$": "identity-obj-proxy"
   },
};

export default createJestConfig(customJestConfig);



