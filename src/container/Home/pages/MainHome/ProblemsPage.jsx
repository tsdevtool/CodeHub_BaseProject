import Sidebar from "@/components/MainHome/Sidebar";
import Topbar from "@/components/MainHome/Topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs";
import { firestore } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    ListFilter,
    Shuffle,
} from "lucide-react";
import { useEffect, useState } from 'react';


const ProblemsPage = () => {
    const [problemList, setProblemList] = useState([]);
	useEffect(() => {
		(async () => {
			const data = await getDocs(collection(firestore, 'Problems'));
			const problemLists = data.docs.map(doc => doc.data());
			setProblemList(problemLists);
		})();
	});

    return <div className="flex min-h-screen w-full flex-col bg-black">

        {/* Topbar */}
        <Topbar />
        {/* Sidebar */}
        <Sidebar />
        {/* Mainbar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ml-16">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 gap-1">
                                    <ListFilter className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Filter
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem checked>Title</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Difficulty</DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>Type</DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" className="h-8 gap-1">
                            <Shuffle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Random one
                            </span>
                        </Button>
                    </div>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <h1 className="text-white text-3xl font-medium">Problems</h1>
                            <CardDescription>
                                Level up your coding abilities! Explore problems designed for all skill sets, from beginner to advanced.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="hidden w-[100px] sm:table-cell">
                                            <span className="sr-only">Image</span>
                                        </TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Difficulty</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Type
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {problemList.map ((item, index) =>(
                                        <TableRow key={index}>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="w-[64px] h-[64px] bg-[url('https://t4.ftcdn.net/jpg/02/67/40/21/360_F_267402109_jZvsqRQUvSxohAOmcUt549jlapqoRHM0.jpg')] bg-cover rounded"></div>
                                            </TableCell>

                                            <TableCell className="hidden sm:table-cell">
                                                <div
													 className="font-medium text-white"
													onClick={() => (window.location.href = '/coding')}
												>
													{item.title}
												</div>
                                            </TableCell>
                                            <TableCell className="font-medium text-white">
                                            <Badge variant="outline" className={"text-yellow-300"}>{item.difficulty}</Badge>
                                            {/* {item.difficulty} */}
                                            
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-white">
                                            {item.type}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-4</strong> of <strong>321</strong>{" "}
                                Problems
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    </div>
}

export default ProblemsPage;