import { ReactLenis } from '@studio-freight/react-lenis';
import BentoGrid from './components/BentoGrid.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import InfoLanding from './components/InfoLanding.jsx';
import PreviewLanding from './components/PreviewLanding.jsx';
import TopBar from './components/TopBar.jsx';
import { useEffect, useState } from "react";
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react'
import BackgroundCircles from './components/BackgroundCircles.jsx';
import PlanOptions from './components/PlanOptions.jsx';

const IndexHome = () => {
	const [color, setColor] = useState("#000000");

	useEffect(() => {
		setColor("#000000");
	}, []);

	const animate = {
		initial: {
			y: '-50%',
			opacity: 0,
		},
		open: (i) => ({
			y: '0%',
			opacity: 1,
			transition: { duration: 1, delay: 0.1 * i, ease: [0.33, 1, 0.68, 1] },
		}),
	};

	return (
		<ReactLenis
			root
			easing={(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))}
		>
			<TopBar />
			<section className='flex min-h-screen w-full flex-col relative'>
				{/* Background Circles */}
				<BackgroundCircles />
				<Header />
				<div className='z-50 flex justify-center space-x-2 md:space-x-4'>
					<Button asChild size='sm' className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors">
						<motion.a
							href='https://youtu.be/qP5ZhibWHJs?si=vZ6eZigD-_90S6VW'
							initial="initial"
							animate="open"
							variants={animate}
							custom={4}
						>
							<Play className="w-4 h-4 mr-2" />
							Watch Demo
						</motion.a>
					</Button>
					<Button asChild size='sm' className="inline-flex items-center px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors">
						<motion.a
							href='https://github.com/LeTranTrongNghia/CodeHub_BaseProject.git'
							initial="initial"
							animate="open"
							variants={animate}
							custom={4}
						>
							<Github className='h-4 w-4' />
							<span className='ml-3'>Star on Github</span>
						</motion.a>
					</Button>
				</div>
				<PreviewLanding />

			</section>
			<BentoGrid />
			<InfoLanding />
			<PlanOptions />
			<Footer />
		</ReactLenis>
	);
};

export default IndexHome;