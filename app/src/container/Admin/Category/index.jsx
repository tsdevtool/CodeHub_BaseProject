import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'react-toastify';
import { PlusCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axios from 'axios';
import Sidebar from '@/components/Admin/Sidebar';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from '@/components/ui/pagination';

const Admin = () => {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [title, setTitle] = useState('');
    const [statement, setStatement] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [type, setType] = useState('');
    const [constraints, setConstraints] = useState('');
    const [testCases, setTestCases] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProblemId, setCurrentProblemId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const handleSearchChange = event => {
        const searchText = event.target.value.toLowerCase();
        setSearchTerm(searchText);
        const filteredList = problems.filter(problem => {
            return (
                problem.title.toLowerCase().includes(searchText) ||
                problem.difficulty.toLowerCase().includes(searchText) ||
                problem.statement.toLowerCase().includes(searchText) ||
                problem.type.toLowerCase().includes(searchText)
            );
        });
        setFilteredProblems(filteredList);
    };

    const paginatedProblems = filteredProblems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const response = await axios.get('http://localhost:5050/problem');
            console.log('API Response:', response.data);

            if (Array.isArray(response.data)) {
                setProblems(response.data);
                setFilteredProblems(response.data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            toast.error('Error fetching problems: ' + error.message);
            setProblems([]);
            setFilteredProblems([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const problemData = {
            title,
            statement,
            difficulty,
            type,
            constraints,
            testCases
        };

        try {
            if (isEditing) {
                await axios.patch(`http://localhost:5050/problem/${currentProblemId}`, problemData);
                toast.success('Problem updated successfully');
            } else {
                await axios.post('http://localhost:5050/problem', problemData);
                toast.success('Problem added successfully');
            }
            fetchProblems();
            resetForm();
        } catch (error) {
            toast.error('Error saving problem: ' + error.message);
        }
    };

    const handleEdit = (problem) => {
        setTitle(problem.title);
        setStatement(problem.statement);
        setDifficulty(problem.difficulty);
        setType(problem.type);
        setConstraints(problem.constraints);
        setTestCases(problem.testCases || []);
        setCurrentProblemId(problem._id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5050/problem/${id}`);
            toast.success('Problem deleted successfully');
            fetchProblems();
        } catch (error) {
            toast.error('Error deleting problem: ' + error.message);
        }
    };

    const resetForm = () => {
        setTitle('');
        setStatement('');
        setDifficulty('');
        setType('');
        setConstraints('');
        setTestCases([]);
        setIsEditing(false);
        setCurrentProblemId(null);
    };

    const handleAddTestCase = () => {
        setTestCases([...testCases, { explanation: '', inputText: '', outputText: '' }]);
    };

    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = [...testCases];
        updatedTestCases[index][field] = value;
        setTestCases(updatedTestCases);
    };

    const handleRemoveTestCase = (index) => {
        const updatedTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(updatedTestCases);
    };

    return (
        <div className='flex min-h-screen w-full flex-col'>
            <Sidebar />
            
            <main className='flex flex-1 items-center flex-col gap-4 p-4 ml-16'>
                <Tabs defaultValue='all'>
                    <div className='flex items-center'>
                        <div className='ml-auto flex items-center gap-2'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size='lg' className='h-8 gap-1'>
                                        <PlusCircle className='h-3.5 w-3.5' />
                                        <span className='sr-only'>Add Problem</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='max-h-[80vh] overflow-y-auto'>
                                    <DialogHeader>
                                        <DialogTitle>Add/Edit Problem</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
                                        <Label htmlFor='title'>Title</Label>
                                        <Input id='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                                        <Label htmlFor='statement'>Statement</Label>
                                        <Input id='statement' value={statement} onChange={(e) => setStatement(e.target.value)} />
                                        <Label htmlFor='difficulty'>Difficulty</Label>
                                        <Input id='difficulty' value={difficulty} onChange={(e) => setDifficulty(e.target.value)} />
                                        <Label htmlFor='type'>Type</Label>
                                        <Input id='type' value={type} onChange={(e) => setType(e.target.value)} />
                                        <Label htmlFor='constraints'>Constraints</Label>
                                        <Input id='constraints' value={constraints} onChange={(e) => setConstraints(e.target.value)} />

                                        <div>
                                            <h2 className='text-lg font-medium'>Test Cases</h2>
                                            {testCases.map((testCase, index) => (
                                                <div key={index} className='flex flex-col space-y-2'>
                                                    <Label htmlFor={`explanation-${index}`}>Explanation</Label>
                                                    <Input
                                                        id={`explanation-${index}`}
                                                        value={testCase.explanation}
                                                        onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                                                    />
                                                    <Label htmlFor={`inputText-${index}`}>Input Text</Label>
                                                    <Input
                                                        id={`inputText-${index}`}
                                                        value={testCase.inputText}
                                                        onChange={(e) => handleTestCaseChange(index, 'inputText', e.target.value)}
                                                    />
                                                    <Label htmlFor={`outputText-${index}`}>Output Text</Label>
                                                    <Input
                                                        id={`outputText-${index}`}
                                                        value={testCase.outputText}
                                                        onChange={(e) => handleTestCaseChange(index, 'outputText', e.target.value)}
                                                    />
                                                    <Button type='button' onClick={() => handleRemoveTestCase(index)}>Remove Test Case</Button>
                                                </div>
                                            ))}
                                            <Button type='button' onClick={handleAddTestCase}>Add Test Case</Button>
                                        </div>

                                        <Button type='submit'>{isEditing ? 'Update Problem' : 'Add Problem'}</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <TabsContent value='all'>
                        <Card x-chunk='dashboard-06-chunk-0'>
                            <CardHeader>
                                <h1 className='text-3xl font-medium'>Problems</h1>
                                <CardDescription>
                                    <div className='flex justify-between items-center'>
                                        <h1 className='text-sm font-medium'>
                                            Level up your coding abilities! Explore problems designed
                                            for all skill sets, from beginner to advanced.
                                        </h1>
                                        <form className='ml-auto flex-1 sm:flex-initial'>
                                            <div className='relative'>
                                                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                                                <Input
                                                    type='search'
                                                    placeholder='Search problems...'
                                                    className='pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]'
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                />
                                            </div>
                                        </form>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className=''>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Difficulty</TableHead>
                                                <TableHead>Statement</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedProblems.map((problem) => (
                                                <TableRow key={problem._id}>
                                                    <TableCell>{problem.title}</TableCell>
                                                    <TableCell>{problem.type}</TableCell>
                                                    <TableCell>{problem.difficulty}</TableCell>
                                                    <TableCell>{problem.statement}</TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => handleEdit(problem)}>Edit</Button>
                                                        <Button onClick={() => handleDelete(problem._id)}>Delete</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Pagination>
                                    <PaginationContent>
                                        {currentPage > 1 && (
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                />
                                            </PaginationItem>
                                        )}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                            pageNumber => (
                                                <PaginationItem key={pageNumber}>
                                                    {pageNumber === currentPage ? (
                                                        <span className='text-black font-bold'>
                                                            {pageNumber}
                                                        </span>
                                                    ) : (
                                                        <PaginationLink
                                                            onClick={() => handlePageChange(pageNumber)}
                                                        >
                                                            {pageNumber}
                                                        </PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            ),
                                        )}
                                        {currentPage < totalPages && (
                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                />
                                            </PaginationItem>
                                        )}
                                        {totalPages > 5 &&
                                            currentPage !== totalPages &&
                                            currentPage !== 1 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                    </PaginationContent>
                                </Pagination>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Admin;