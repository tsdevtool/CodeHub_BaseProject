import { Info } from 'lucide-react';
import { executeCode } from '/src/container/Workspace/Code_Editor/constant/api';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Output = ({ editorValue, language }) => {
	const [form, setForm] = useState({
		title: '',
		type: '',
		difficulty: '',
		statement: '',
		constraints: '',
		testCases: [
			{
				explanation: '',
				inputText: '',
				outputText: '',
			},
		],
	});
	const [output, setOutput] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [passedTests, setPassedTests] = useState(0);
	const params = useParams();
	const navigate = useNavigate();
	const [data, setData] = useState([]);
	const [correctnessRating, setCorrectnessRating] = useState(0);
	const [performanceRating, setPerformanceRating] = useState(0);
	const [clarityRating, setClarityRating] = useState(0);
	const [generatingAnswer, setGeneratingAnswer] = useState(false);
	const id = useSelector(state => state.user.id);

	useEffect(() => {
		async function fetchData() {
			const id = params.id?.toString() || undefined;
			if (!id) return;
			const response = await fetch(`http://localhost:5050/problem/${id}`);
			if (!response.ok) {
				const message = `An error has occurred: ${response.statusText}`;
				console.error(message);
				return;
			}
			const problem = await response.json();
			if (!problem) {
				console.warn(`Problem with id ${id} not found`);
				navigate('/');
				return;
			}
			setForm(problem);
		}
		fetchData();
	}, [params.id, navigate]);

	const [executionTime, setExecutionTime] = useState(null);

	const runCode = async () => {
		// Use the code string passed as editorValue instead of using editorRef.current.getValue()
		const sourceCode = editorValue;
		if (!sourceCode) return;
	  
		setIsLoading(true);
		setErrorMessage(null);
	  
		const startTime = Date.now();
	  
		try {
		  const { run: result } = await executeCode(language, sourceCode);
		  // Make sure result.output exists and is a string before splitting
		  if (!result || typeof result.output !== "string") {
			throw new Error("Invalid output received from code execution.");
		  }
		  const userOutput = result.output.split("\n");
		  setOutput(userOutput);
		  const passed = checkTestcase(userOutput);
		  if (passed === form.testCases.length) {
			toast.success(`Congratulations! All ${passed} test cases passed! 🎉`);
		  } else {
			toast.error(
			  `Your code passed ${passed} out of ${form.testCases.length} test cases.`
			);
		  }
		} catch (error) {
		  console.error(error);
		  setIsError(true);
		  setErrorMessage("An error occurred while running your code.");
		} finally {
		  const endTime = Date.now();
		  const time = endTime - startTime;
		  setExecutionTime(time);
		  setIsLoading(false);
		}
	  };
	  
	// const runCode = async () => {
	// 	const sourceCode = editorRef.current.getValue();
	// 	if (!sourceCode) return;

	// 	setIsLoading(true);
	// 	setErrorMessage(null);

	// 	try {
	// 		const { run: result } = await executeCode(language, sourceCode);
	// 		const userOutput = result.output.split('\n');
	// 		setOutput(userOutput);
	// 		const passed = checkTestcase(userOutput);
	// 		if (passed === form.testCases.length) {
	// 			toast.success(`Congratulations! All ${passed} test cases passed! 🎉`);
	// 		} else {
	// 			toast.error(
	// 				`Your code passed ${passed} out of ${form.testCases.length} test cases.`,
	// 			);
	// 		}
	// 	} catch (error) {
	// 		console.error(error);
	// 		setIsError(true);
	// 		setErrorMessage('An error occurred while running your code.');
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	const checkTestcase = userOutput => {
		const sourceCode = editorValue;
		let passed = 0;
		const printKeywords = [
			'console.log(',
			'print(',
			'System.out.println(',
			'System.out.print(',
			'Console.WriteLine(',
			'Console.Write(',
		];

		const isOnlyprint = sourceCode
			.trim()
			.split('\n')
			.every(line => {
				const trimmedLine = line.trim();
				return (
					printKeywords.some(keyword => trimmedLine.startsWith(keyword)) ||
					trimmedLine === ''
				);
			});

		if (isOnlyprint) {
			toast.error('Failed! Source code only contains print function.');
			setPassedTests(0);
			return 0;
		} else {
			const expectedOutputs = form.testCases.map(tc => tc.outputText.trim());
			expectedOutputs.forEach(expectedOutput => {
				if (userOutput.includes(expectedOutput)) {
					passed++;
				}
			});
			setPassedTests(passed);
			return passed;
		}
	};

	const requestRating = async () => {
		// const sourceCode = editorRef.current.getValue();
		const sourceCode = editorValue;
		setGeneratingAnswer(true);
		console.log('Requesting rating...');

		try {
			const response = await axios({
				url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${
					import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
				}`,
				method: 'post',
				data: {
					contents: [
						{
							parts: [
								{
									text: `Rate the following code on a scale from 1 to 100 for the following criteria:\n\nCorrectness\nPerformance\nClarity\nGive me the answer of numbers in order only, for example: 90\n70\n80\n.\n\nCode:\n${sourceCode}`,
								},
							],
						},
					],
				},
			});

			const ratingsText =
				response.data.candidates[0]?.content?.parts[0]?.text?.trim();
			if (ratingsText) {
				const ratings = ratingsText.split('\n');
				if (ratings.length === 3) {
					setCorrectnessRating(Number(ratings[0]));
					setPerformanceRating(Number(ratings[1]));
					setClarityRating(Number(ratings[2]));
					console.log('Ratings received:');
					console.log('Correctness:', ratings[0]);
					console.log('Performance:', ratings[1]);
					console.log('Clarity:', ratings[2]);

					// Add delay before updating chart data
					await new Promise(resolve => setTimeout(resolve, 200)); // 1000 ms = 1 second

					// Update chart data after delay
					setData([
						{
							activity: 'Correctness',
							value: Number(ratings[0]),
							fill: 'var(--color-Correctness)',
						},
						{
							activity: 'Performance',
							value: Number(ratings[1]),
							fill: 'var(--color-Performance)',
						},
						{
							activity: 'Clarity',
							value: Number(ratings[2]),
							fill: 'var(--color-Clarity)',
						},
					]);
				} else {
					console.log('Unexpected response format:', ratingsText);
				}
			} else {
				console.log('Response data is missing expected fields:', response.data);
			}
		} catch (error) {
			console.log('Error while requesting ratings:', error);
		} finally {
			setGeneratingAnswer(false);
		}
	};

	const handleSubmit = () => {
		if (passedTests === form.testCases.length) {
			toast.success('Congratulations! All test cases are passed! 🎉🎉🎉');
			requestRating();
			updateProgress();
		} else {
			toast.error(
				`You passed ${passedTests} out of ${form.testCases.length} test cases.`,
			);
		}
	};

	const updateProgress = async () => {
		try {
			// Fetch all progress entries
			const response = await fetch('http://localhost:5050/progress/');
			if (!response.ok) {
				throw new Error(`An error occurred: ${response.statusText}`);
			}
			const allProgress = await response.json();

			// Find the progress item for the current user
			const userProgress = allProgress.data.items.find(progress => progress.user_id === id);
			
			if (!userProgress) {
				console.error('No progress found for current user');
				return;
			}

			// Create new exercise entry
			const newExercise = {
				exercise_id: params.id, // Current problem ID
				completion_date: new Date()
			};

			// Add new exercise to existing exercises array
			const updatedExercises = [...userProgress.exercises, newExercise];

			// Update progress with new exercises array
			const updateResponse = await fetch(`http://localhost:5050/progress/${userProgress._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					exercises: updatedExercises
				}),
			});

			if (!updateResponse.ok) {
				throw new Error(`An error occurred: ${updateResponse.statusText}`);
			}

			const data = await updateResponse.json();
			console.log('Progress updated:', data);

		} catch (error) {
			console.error('Error updating progress:', error);
		}
	};

	// const requestCodeReview = async () => {
	// 	const sourceCode = editorRef.current.getValue();
	// 	setGeneratingAnswer(true);
	// 	console.log('Requesting code review...');

	// 	try {
	// 		const response = await axios({
	// 			url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
	// 			method: 'post',
	// 			data: {
	// 				contents: [
	// 					{
	// 						parts: [
	// 							{
	// 								text: `Review the following code and provide a summary including the advantages, disadvantages, and suggestions for improvement.\n\nCode:\n${sourceCode}\n\nPlease format the response as follows:\n- Advantages:...\n- Disadvantages:...\n- Suggestions:...\n`,
	// 							},
	// 						],
	// 					},
	// 				],
	// 			},
	// 		});

	// 		const reviewText = response.data.candidates[0]?.content?.parts[0]?.text?.trim();
	// 		if (reviewText) {
	// 			// Example of splitting the review text if it's formatted with newlines
	// 			const [advantages, disadvantages, suggestions] = reviewText.split('\n- ').map(part => part.trim()).filter(Boolean);

	// 			// Validate and format the review data
	// 			const isValid = (text) => text && typeof text === 'string' && text.trim().length > 0;

	// 			const formattedAdvantages = isValid(advantages) ? advantages : 'No pros about the code.';
	// 			const formattedDisadvantages = isValid(disadvantages) ? disadvantages : 'No cons about the code.';
	// 			const formattedSuggestions = isValid(suggestions) ? suggestions : 'No suggestions about the code.';

	// 			console.log('Code Review Received:');
	// 			console.log('Advantages:', formattedAdvantages);
	// 			console.log('Disadvantages:', formattedDisadvantages);
	// 			console.log('Suggestions:', formattedSuggestions);

	// 			// Update UI with the review data if necessary
	// 			setAdvantages(formattedAdvantages);
	// 			setDisadvantages(formattedDisadvantages);
	// 			setSuggestions(formattedSuggestions);
	// 		} else {
	// 			console.log('Response data is missing expected fields:', response.data);
	// 		}
	// 	} catch (error) {
	// 		console.log('Error while requesting code review:', error);
	// 	} finally {
	// 		setGeneratingAnswer(false);
	// 	}
	// };

	// // Define initial values for advantages, disadvantages, and suggestions
	// const DEFAULT_PROS = 'No advantages about the code.';
	// const DEFAULT_CONS = 'No disadvantages about the code.';
	// const DEFAULT_SUGGESTIONS = 'No suggestions about the code.';

	// // Example state management using React's useState hook
	// const [advantages, setAdvantages] = useState(DEFAULT_PROS);
	// const [disadvantages, setDisadvantages] = useState(DEFAULT_CONS);
	// const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

	return (
		<div className='flex flex-col w-full mt-4'>
			<div className='flex justify-between items-center mb-2'>
				<button
					className='bg-green-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-green-700 transition-all duration-300'
					onClick={runCode}
				>
					Run Code
				</button>
				<Dialog>
					<DialogTrigger asChild>
						<Button
							className={`px-4 py-2 rounded-md text-white 
				${passedTests === form.testCases.length ? 'bg-green-500' : 'bg-red-500'}
			 `}
							disabled={passedTests !== form.testCases.length}
							onClick={handleSubmit}
						>
							Submit ({passedTests}/{form.testCases.length})
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-[425px]'>
						<DialogHeader>
							<DialogTitle>Good work!</DialogTitle>
							<DialogDescription>
								Congratulations on acing the test! Your hard work and dedication
								have paid off. 🎉🎉🎉
							</DialogDescription>
						</DialogHeader>

						<div className='grid gap-3'>
							<div className='flex justify-between items-center'>
								<Label htmlFor='content' className='flex-shrink-0'>
									Overall Review
								</Label>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant='ghost' size='icon'>
												<Info className='size-4' />
											</Button>
										</TooltipTrigger>
										<TooltipContent side='top'>
											{executionTime !== null
												? `Run time: ${executionTime} ms`
												: 'No execution time yet'}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<Card className='max-w'>
								<CardContent className='flex gap-4 p-4'>
									<div className='grid items-center gap-2'>
										{['Correctness', 'Performance', 'Clarity'].map(
											(criteria, idx) => (
												<div
													key={idx}
													className='grid flex-1 auto-rows-min gap-0.5'
												>
													<div className='text-sm text-muted-foreground'>
														{criteria}
													</div>
													<div
														className={`flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none ${
															idx === 0
																? 'text-[#e88c30]'
																: idx === 1
																? 'text-[#2eb88a]'
																: 'text-[#2662d9]'
														}`}
													>
														{criteria === 'Correctness'
															? correctnessRating !== null
																? `${correctnessRating}/100`
																: 'N/A'
															: criteria === 'Performance'
															? performanceRating !== null
																? `${performanceRating}/100`
																: 'N/A'
															: criteria === 'Clarity'
															? clarityRating !== null
																? `${clarityRating}/100`
																: 'N/A'
															: 'N/A'}
														<span className='text-sm font-normal text-muted-foreground'>
															points
														</span>
													</div>
												</div>
											),
										)}
									</div>
									<ChartContainer
										config={{
											Correctness: {
												label: 'Correctness',
												color: 'hsl(var(--chart-3))',
											},
											Performance: {
												label: 'Performance',
												color: 'hsl(var(--chart-2))',
											},
											Clarity: {
												label: 'Clarity',
												color: 'hsl(var(--chart-1))',
											},
										}}
										className='mx-auto aspect-square w-full max-w-[80%]'
									>
										<RadialBarChart
											margin={{ left: -10, right: -10, top: -10, bottom: -10 }}
											data={data}
											innerRadius='20%'
											barSize={24}
											startAngle={90}
											endAngle={450}
										>
											<PolarAngleAxis
												type='number'
												domain={[0, 100]}
												dataKey='value'
												tick={false}
											/>
											<RadialBar dataKey='value' background cornerRadius={5} />
										</RadialBarChart>
									</ChartContainer>
								</CardContent>
							</Card>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{isError && (
				<div className='text-red-500 text-sm mb-2'>{errorMessage}</div>
			)}

			<div
				className={`h-full p-2 rounded-md border-gray-300 border ${
					isError ? 'border-red-500 text-red-400' : ''
				}`}
			>
				{isLoading ? (
					<div className='text-center mt-2'>
						<i className='fas fa-spinner fa-spin'></i> Loading...
					</div>
				) : output ? (
					output.map((line, i) => (
						<div key={i} className='text-sm'>
							{line}
						</div>
					))
				) : (
					<div>Click "Run Code" to see the output here</div>
				)}
			</div>
		</div>
	);
};

export default Output;
