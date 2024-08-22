import React, { useEffect, useState } from "react";
import axios from 'axios';
import {
    Box, Grid, Card, CardContent, Typography, CircularProgress,
    IconButton, Table, TableBody, TableCell, TableHead, TableRow,
    Avatar
} from '@mui/material';
import {
    School as SchoolIcon,
    Person as PersonIcon,
    PersonOff as PersonOffIcon,
    Leaderboard as LeaderboardIcon,
    MilitaryTech as MilitaryTechIcon
} from '@mui/icons-material';
import Header from './Header';
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [data, setData] = useState({
        totalEmployees: 0,
        coursesUploaded: 0,
        activeEmployees: 0,
        inactiveEmployees: 0
    });

    const [loading, setLoading] = useState(true);
    const [leaderboard, setLeaderboard] = useState([
        { name: "John Doe", credits: 150 },
        { name: "Jane Smith", credits: 140 },
        { name: "Alice Johnson", credits: 130 },
        { name: "Bob Brown", credits: 120 },
        { name: "Charlie Davis", credits: 100 }
    ]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/dashboard')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the dashboard data!", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const cardStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#f5f5f5',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
            backgroundColor: '#e0e0e0',
        },
        textDecoration: 'none',
        marginBottom: '0px'
    };

    const iconStyles = {
        width: 40,
        height: 40
    };

    const medalStyles = (color) => ({
        fontSize: '24px',
        color: color,
        marginRight: '8px'
    });

    return (
        <>
            <Header welcomeMessage={"Welcome, HR Dashboard"} />
            <Box sx={{ padding: '16px', backgroundColor: '#e3f2fd', minHeight: '100vh' }}>
                <Grid container spacing={2} sx={{ marginBottom: '-280px' }}>
                    <Grid item xs={12} md={4}>
                        <Link to='/all-employees' style={{ textDecoration: 'none' }}>
                            <Card sx={cardStyles}>
                                <CardContent>
                                    <Typography variant="h6">Total Employees</Typography>
                                    <Typography variant="h4">{data.totalEmployees}</Typography>
                                </CardContent>
                                <IconButton>
                                    <Avatar 
                                        src="https://cdn-icons-png.flaticon.com/128/9166/9166875.png"
                                        sx={iconStyles}
                                    />
                                </IconButton>
                            </Card>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Link to='/all-courses' style={{ textDecoration: 'none' }}>
                            <Card sx={cardStyles}>
                                <CardContent>
                                    <Typography variant="h6">Total Courses</Typography>
                                    <Typography variant="h4">{data.coursesUploaded}</Typography>
                                </CardContent>
                                <IconButton>
                                    <SchoolIcon sx={iconStyles} />
                                </IconButton>
                            </Card>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ ...cardStyles, flexDirection: 'column' }}>
                            <CardContent>
                                <Typography variant="h6"><LeaderboardIcon />Leaderboard</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Credits</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {leaderboard.map((employee, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {index === 0 && <MilitaryTechIcon sx={medalStyles("#FFD700")} />}
                                                    {index === 1 && <MilitaryTechIcon sx={medalStyles("#C0C0C0")} />}
                                                    {index === 2 && <MilitaryTechIcon sx={medalStyles("#CD7F32")} />}
                                                    {employee.name}
                                                </TableCell>
                                                <TableCell>{employee.credits}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ marginTop: '0px' }}>
                    <Grid item xs={12} md={4}>
                        <Link to='/active-employees' style={{ textDecoration: 'none' }}>
                            <Card sx={cardStyles}>
                                <CardContent>
                                    <Typography variant="h6">Active Employees</Typography>
                                    <Typography variant="h4">{data.activeEmployees}</Typography>
                                </CardContent>
                                <IconButton>
                                    <PersonIcon sx={iconStyles} />
                                </IconButton>
                            </Card>
                        </Link>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Link to='/inactive-employees' style={{ textDecoration: 'none' }}>
                            <Card sx={cardStyles}>
                                <CardContent>
                                    <Typography variant="h6">Inactive Employees</Typography>
                                    <Typography variant="h4">{data.inactiveEmployees}</Typography>
                                </CardContent>
                                <IconButton>
                                    <PersonOffIcon sx={iconStyles} />
                                </IconButton>
                            </Card>
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Dashboard;
