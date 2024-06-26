import React, { useEffect, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { AiFillLike, AiFillDislike, AiFillStar } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';

const ProblemDescription = () => {
	const renderProblem = useSelector(state => state.problem.selectedProblem);

	const [testcase1, setTestcase1] = useState({});
	const [testcase2, setTestcase2] = useState({});

	const getDocumentById = async docId => {
		// Tạo tham chiếu đến document với ID được cung cấp
		const docRef = doc(firestore, 'TestCases', docId);

		try {
			// Lấy document
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				// Document tồn tại, in ra dữ liệu của nó
				return docSnap.data();
			} else {
				// Document không tồn tại
				console.log('No such document!');
			}
		} catch (error) {
			// Xử lý lỗi nếu có
			console.error('Error getting document:', error);
		}
	};
	const fetchAndLogDocument = async () => {
		try {
			const testCase1 = await getDocumentById(renderProblem.testCaseId[0]);
			setTestcase1(testCase1);
			const testCase2 = await getDocumentById(renderProblem.testCaseId[1]);
			setTestcase2(testCase2);
		} catch (error) {
			console.error('Error fetching document:', error);
		}
	};

	useEffect(() => {
		fetchAndLogDocument();
	}, []);

	return (
		<div
			className='relative flex-col items-start gap-8 md:flex ml-14'
			x-chunk='dashboard-03-chunk-0'
		>
			<form className='grid w-full items-start gap-6'>
				<fieldset className='grid gap-6 rounded-lg border p-4'>
					<legend className='-ml-1 px-1 text-lg font-medium'>Problem</legend>
					<div className='grid gap-3 w-full'>
						{/* Problem Title */}
						<div className='mr-2 text-2xl   font-medium'>
							{renderProblem.title}
						</div>

						{/* Problem Sub-bar */}
						<div className='flex items-center'>
							<div className='inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-x font-medium capitalize text-green-400 bg-green-100'>
								{renderProblem.difficulty}
							</div>
							<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-dark-green-s'>
								<BsCheck2Circle />
							</div>
							<div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'>
								<AiFillLike className='text-dark-blue-s' />
								<span className='text-lg'>{renderProblem.likes}</span>
							</div>
							<div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-dark-gray-6'>
								<AiFillDislike className='text-dark-blue-s' />
								<span className='text-lg'>{renderProblem.dislikes}</span>
							</div>
							<div className='cursor-pointer hover:bg-dark-fill-3  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-dark-gray-6 '>
								<AiFillStar className='text-dark-yellow' />
							</div>
						</div>
						{/* Problem Statement */}
						<div className='  text-lg'>
							<div
								dangerouslySetInnerHTML={{
									__html: renderProblem.statement,
								}}
							/>
						</div>
						{/* Examples */}
						<div className=''>
							{/* {problem.examples.map((example, index) => (
								<div key={example.id}>
									<p className='font-medium   text-lg'>Example:</p> */}

							<div className='example-card'>
								<pre className='text-wrap'>
									<p className='font-medium   text-lg'>Example 1:</p>
									<strong className=' '>Input: </strong> {testcase1?.inputText}
									<br />
									<strong className=' '>Output: </strong>
									{testcase1?.outputText} <br />
									{testcase1?.explanation && (
										<>
											<strong className=' '>Explanation:</strong>{' '}
											{testcase1?.explanation}
											<br /> {/* Added <br/> tag */}
										</>
									)}
								</pre>
							</div>

							<div className='example-card'>
								<pre className='text-wrap'>
									<p className='font-medium   text-lg'>Example 2:</p>
									<strong className=' '>Input: </strong> {testcase2?.inputText}
									<br />
									<strong className=' '>Output: </strong>
									{testcase2?.outputText} <br />
									{testcase2?.explanation && (
										<>
											<strong className=' '>Explanation:</strong>{' '}
											{testcase2?.explanation}
											<br /> {/* Added <br/> tag */}
										</>
									)}
								</pre>
							</div>
							{/* </div>
							))} */}
						</div>
						{/* Constraints */}
						<div>
							<div className='  text-lg font-medium'>Constraints:</div>
							<ul className='  list-disc text-lg'>
								<div
									dangerouslySetInnerHTML={{
										__html: renderProblem.constraints,
									}}
								/>
							</ul>
						</div>
					</div>
				</fieldset>
			</form>
		</div>
	);
};
export default ProblemDescription;
