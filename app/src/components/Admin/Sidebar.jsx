import { Book, Code2, Triangle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
	const navigate = useNavigate();
	const handleLogout = () => {
		try {
			signOut(auth);
			toast.success('Logout successfully');
			navigate('/login');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<aside className='inset-y fixed left-0 z-20 flex h-full flex-col border-r'>
			<div className='p-2 mt-1'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant='outline' size='icon' aria-label='Home'>
								<Triangle className='size-5 fill-foreground' />
							</Button>
						</TooltipTrigger>
						<TooltipContent side='right' sideOffset={5}>
							<p>DevLab Admin</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='grid gap-1 p-2'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='rounded-lg '
								aria-label='API'
							>
								<a href='/admin/problem'>
									<Code2 className='size-5' />
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent side='right' sideOffset={5}>
							Problem
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='rounded-lg '
								aria-label='Documentation'
							>
								<a href='/coursesAdmin'>
									<Book className='size-5' />
								</a>
							</Button>
						</TooltipTrigger>
						<TooltipContent side='right' sideOffset={5}>
							Courses
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className='mt-auto grid gap-1 p-2'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='mt-auto rounded-lg '
								aria-label='Help'
							>
								<LogOut className='size-5' onClick={handleLogout} />
							</Button>
						</TooltipTrigger>
						<TooltipContent side='right' sideOffset={5}>
							Log out
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</aside>
	);
};
export default Sidebar;
