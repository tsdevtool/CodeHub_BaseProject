
const LecturesPage = () => {
	
	return (
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
					<table className='text-sm text-left text-gray-500 dark:text-gray-400 sm:w-7/12 w-full max-w-[1200px] mx-auto'>
						<thead className='text-xs text-gray-700 uppercase dark:text-gray-400 border-b'>
							<tr>
								<th scope='col' className='px-1 py-3 w-0 font-medium'>Status</th>
								<th scope='col' className='px-1 py-3 w-0 font-medium'>Title</th>
								<th scope='col' className='px-1 py-3 w-0 font-medium'>Content</th>
								<th scope='col' className='px-1 py-3 w-0 font-medium'>Created at</th>
								<th scope='col' className='px-1 py-3 w-0 font-medium'>Solution</th>
							</tr>
						</thead>
					</table>
				</div>
			</main>
		</div>
	);
};

export default LecturesPage;
