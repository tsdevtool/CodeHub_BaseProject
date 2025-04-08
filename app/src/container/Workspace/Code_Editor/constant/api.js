import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants";

// Create API instance for our server
const serverAPI = axios.create({
  baseURL: "http://localhost:5050", // Use your actual server URL
});

// Comment out the external API since we're not using it
// const externalAPI = axios.create({
//   baseURL: "https://emkc.org/api/v2/piston",
// });

export const executeCode = async (language, sourceCode) => {
  try {
    // Use our server endpoint instead of the external API
    const response = await serverAPI.post("/code/execute", {
      language: language.toLowerCase(),
      sourceCode: sourceCode,
    });
    
    return {
      run: {
        stdout: response.data.output,
        stderr: response.data.error ? response.data.output : "",
        output: response.data.output,
      }
    };
  } catch (error) {
    console.error("Error executing code:", error);
    return {
      run: {
        stdout: "",
        stderr: error.message || "Execution failed",
        output: error.message || "Execution failed",
      }
    };
  }
};