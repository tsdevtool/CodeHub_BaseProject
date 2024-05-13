// Output.jsx

import React, { useState } from 'react';
import { executeCode } from '/src/container/Workspace/Code_Editor/constant/api';

const Output = ({ editorRef, language }) => {
	// Receive runCode prop from CodeEditorWrapper
	const [output, setOutput] = useState(null);
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const runCode = async () => {
		const sourceCode = editorRef.current.getValue();
		if (!sourceCode) return;
		try {
			setIsLoading(true);
			const { run: result } = await executeCode(language, sourceCode);
			setOutput(result.output.split('\n'));
			result.stderr ? setIsError(true) : setIsError(false);
		} catch (error) {
			console.error(error);
			// Simulate error handling
			console.error(
				'An error occurred: ',
				error.message || 'Unable to run code',
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full mt-4'>
			<div class="flex justify-between items-center">
				<button
					className={`bg-green-500 p-3 rounded-md hover:bg-green-700 transition-all duration-300 mx-2text-left px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-900 text-white ${isLoading ? 'disabled opacity-50 cursor-not-allowed' : ''
						}`}
					isLoading={isLoading}
					onClick={runCode}
				>
					Run Code
				</button>
				<button
					className="bg-black p-3 rounded-md hover:bg-blue-500 transition-all duration-300 text-left px-4 py-2 rounded-md border border-white"
				>
					Submit
				</button>
			</div>

			<div
				className={`h-full p-2 mt-4 ${isError ? 'text-red-400 border-red-500' : 'border-gray-300'
					} border-2 rounded-md`}
			>
				{output
					? output.map((line, i) => <div key={i}>{line}</div>)
					: 'Click "Run Code" to see the output here'}
			</div>
		</div>
	);
};

export default Output;

{isLoading && (
    <div className="mt-2 text-center">
        <i className="fas fa-spinner fa-spin"></i> Loading...
    </div>
)}

const problemText = 'Write a function that takes a string as input and returns a new string with the characters reversed. For example, if the input is "hello", the output should be "olleh".'
const userCode = editorRef.current.getValue();

async function CheckingCode() {
	try {
		const response = await axios({
			url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
				}`,
			method: 'post',
			data: {
				contents: [
					{
						parts: [
							{
								text:
									'I will ask question, and you will only answer true of false only. ' +
									problemText + 'This is the code I wrote to solve the problem: \n' + userCode +
									"Is this code the code used to solve the above problem? only answer true or false.",
							},
						],
					},
				],
			},
		});

		const check =
			response['data']['candidates'][0]['content']['parts'][0]['text'];
		setAnswer(check);
	} catch (error) {
		console.log(error);
		setAnswer("Sorry - Couldn't check your code at this time.");
	}

	setGeneratingAnswer(false);
}

// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------