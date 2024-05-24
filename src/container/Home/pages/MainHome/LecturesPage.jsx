import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { firestore } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { AiFillYoutube } from 'react-icons/ai';
import { BsCheckCircle } from 'react-icons/bs';
const LecturesPage = () => {
	const [LectureList, setLectureList] = useState([]);
	useEffect(() => {
		(async () => {
			const data = await getDocs(collection(firestore, 'Lectures'));
			const LectureList = data.docs.map(doc => doc.data());
			setLectureList(LectureList);
		})();
	});

	useEffect
	return (
		<>
		<div className='flex min-h-screen w-full flex-col bg-black'>
			{/* Topbar */}
			{/* <Topbar /> */}
			{/* Sidebar */}
			{/* <Sidebar /> */}
			{/* Mainbar */}
			{/* <main className='gap-4 p-4 md:gap-8 md:p-8 ml-16'>
				<div class='aspect-w-16 aspect-h-9 flex w-full'>
					<iframe
						src='https://www.youtube.com/embed/jS4aFq5-91M'
						frameborder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
						allowfullscreen
					></iframe>
				</div>
			</main> */}

			<main className='bg-dark-layer-2 min-h-screen'>
				{/* <Topbar />
				<Sidebar /> */}

				<h1 className='text-2xl text-center text-gray-700 dark:text-gray-400 font-medium uppercase mt-10 mb-5'>&ldquo; COME AND LISTEN TO LECTURES WITH US &ldquo;</h1>
				<div className="relative overflow-x-auto mx-auto px-6 pb-10">
					<Table className='text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
						<TableHeader className='text-xs text-gray-700 uppercase dark:text-gray-400 border-b'>
							<TableRow>
								<TableHead scope='col' className='px-1 py-3 w-0 font-medium'>Status</TableHead>
								<TableHead scope='col' className='px-1 py-3 w-0 font-medium'>Author</TableHead>
								<TableHead scope='col' className='px-1 py-3 w-0 font-medium'>Title</TableHead>
								<TableHead scope='col' className='px-1 py-3 w-0 font-medium'>Language</TableHead>
								<TableHead scope='col' className='px-1 py-3 w-0 font-medium'>Solution</TableHead>
							</TableRow>
							
						</TableHeader>
						<TableBody>
						{LectureList.map((item, index) => (
							<TableRow key={index}>
								<TableHead>
									<BsCheckCircle fontSize={"18"} width={'18'}/>
								</TableHead>
								<TableCell className="px-6 px-4">{item.author}</TableCell>
								<TableCell>
									<div
										className='font-medium'
										onClick={() => (window.location.href = '/coding')}
									>
										{item.title}
									</div>
								</TableCell>
								<TableCell className="px-6 px-4">{item.language}</TableCell>
								<TableCell className="px-6 px-4">
  									{item.video_link ? (
    									<a href={item.video_link} target="_blank" className="flex items-center cursor-pointer hover:text-red-500"><AiFillYoutube fontSize={28} className="cursor-pointer hover:text-red-500" /></a>
  									) : (
    							<p className='text-gray-400'>Coming soon</p>
  								)}
							</TableCell>
							</TableRow>

										))}
						</TableBody>
					</Table>
				</div>
			</main>
		</div>
		</>
	);
};

export default LecturesPage;
