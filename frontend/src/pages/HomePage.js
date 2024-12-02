import React, { useState, useEffect } from 'react';
import MultiSelect from '../components/MultiSelect';
import { TextField, Button, Container, Typography, Box, Paper, Grid, CircularProgress } from '@mui/material';
import { analyzeText, getReferenceData, getAvailableTests } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import Footer from '../components/Footer';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const HomePage = () => {
    const [selectedTests, setSelectedTests] = useState([]);
    const [testValues, setTestValues] = useState({});
    const [analysis, setAnalysis] = useState('');
    const [errors, setErrors] = useState({});
    const [availableTests, setAvailableTests] = useState([]);
    const [referenceData, setReferenceData] = useState({});
    const [loading, setLoading] = useState(false);
    const [validationTriggered, setValidationTriggered] = useState(false); // Dodanie flagi do walidacji

    // Pobranie dostępnych badań przy załadowaniu komponentu
    useEffect(() => {
        const fetchAvailableTests = async () => {
            try {
                const response = await getAvailableTests();
                setAvailableTests(response.tests);
            } catch (error) {
                console.error('Error fetching available tests:', error);
            }
        };

        fetchAvailableTests();
    }, []);

    // Pobranie danych referencyjnych po wybraniu badań
    useEffect(() => {
        const fetchReferenceData = async () => {
            let newReferenceData = {};
            for (const test of selectedTests) {
                try {
                    const response = await getReferenceData(test);
                    newReferenceData[test] = response;
                } catch (error) {
                    console.error(`Error fetching reference data for ${test}:`, error);
                }
            }
            setReferenceData(newReferenceData);
        };

        if (selectedTests.length > 0) {
            fetchReferenceData();
        }
    }, [selectedTests]);

    const validateInput = () => {
        let validationErrors = {};
        selectedTests.forEach(test => {
            const value = testValues[test];
            if (!value || isNaN(value)) {
                validationErrors[test] = 'Wartość musi być liczbą';
            }
        });
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleAnalyze = async () => {
        setValidationTriggered(true); // Uruchamiamy walidację dopiero przy kliknięciu
        if (!validateInput()) {
            return; // Przerwij analizę, jeśli są błędy
        }

        setLoading(true);
        try {
            let textToAnalyze = '';
            selectedTests.forEach(test => {
                const value = testValues[test];
                textToAnalyze += `${test}: ${value}\n`;
            });

            const gptResponse = await analyzeText(textToAnalyze);
            setAnalysis(gptResponse.analysis);
        } catch (error) {
            console.error('Error during analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        const labels = selectedTests;

        const values = selectedTests.map(test => Number(testValues[test]));
        const minValues = selectedTests.map(test => referenceData[test]?.min_value || 0);
        const maxValues = selectedTests.map(test => referenceData[test]?.max_value || 0);

        return {
            labels,
            datasets: [
                {
                    label: 'Twoja wartość',
                    data: values,
                    backgroundColor: 'rgba(75,192,192,0.6)',
                },
                {
                    label: 'Minimum (zakres referencyjny)',
                    data: minValues,
                    backgroundColor: 'rgba(192,75,75,0.6)',
                },
                {
                    label: 'Maximum (zakres referencyjny)',
                    data: maxValues,
                    backgroundColor: 'rgba(75,75,192,0.6)',
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                ticks: {
                    color: '#ffffff', // Biały kolor dla etykiet osi X
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // Biały kolor dla linii siatki (lekkie przezroczystość)
                },
            },
            y: {
                ticks: {
                    color: '#ffffff', // Biały kolor dla etykiet osi Y
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)', // Biały kolor dla linii siatki (lekkie przezroczystość)
                },
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff', // Biały kolor dla etykiet legendy
                },
            },
        },
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundColor: '#009282',
            }}
        >
            <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1, marginBottom: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Paper 
                            elevation={3} 
                            sx={{ 
                                p: 3, 
                                backgroundColor: '#007474',
                                color: '#fff', 
                                borderRadius: '15px', 
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#fff', fontSize: '1.6rem' }}>
                                AI Doctor
                            </Typography>
                            <MultiSelect 
                                options={availableTests} 
                                selectedTests={selectedTests} 
                                setSelectedTests={setSelectedTests} 
                                sx={{
                                    '.MuiSelect-select': {
                                        backgroundColor: '#007474',
                                        color: '#fff',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                    },
                                }}
                            />
                            <Box sx={{ mt: 2 }}>
                                {selectedTests.map(test => (
                                    <TextField
                                    key={test}
                                    label={`Wartość dla: ${test}`}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 1.5 }}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setTestValues(prev => ({ ...prev, [test]: value }));
                                    }}
                                    error={validationTriggered && !!errors[test]}
                                    helperText={validationTriggered && errors[test]}
                                    InputProps={{
                                        sx: {
                                            backgroundColor: '#007474',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            fontSize: '0.85rem',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#ffffff' // Kolor obramówki na biały (by default)
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#ffffff' // Kolor obramówki na biały (hover)
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#ffffff' // Kolor obramówki na biały (active)
                                            }
                                        }
                                    }}
                                    InputLabelProps={{
                                        sx: {
                                            color: '#ffffff', // Kolor etykiety na biały
                                            fontSize: '0.85rem',
                                            '&.Mui-focused': {
                                                color: '#ffffff' // Kolor etykiety na biały w stanie aktywnym
                                            }
                                        }
                                    }}
                                />
                                ))}
                            </Box>
                            <Box textAlign="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleAnalyze}
                                    sx={{
                                        mt: 3,
                                        fontWeight: 'bold',
                                        fontSize: '1em',
                                        padding: '10px 20px',
                                        transition: 'background-color 0.3s ease',
                                        backgroundColor: '#004c4c',
                                        '&:hover': {
                                            backgroundColor: '#003d3d',
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                                        },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} sx={{ color: '#ffffff' }} /> : 'Przeanalizuj wyniki'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        {selectedTests.length > 0 ? (
                            <Box 
                                sx={{ 
                                    height: '400px', 
                                    width: '100%', 
                                    backgroundColor: '#007474', 
                                    borderRadius: '15px', 
                                    p: 2 
                                }}
                            >
                                <Box sx={{ height: '100%', position: 'relative' }}>
                                    <Bar 
                                        data={getChartData()} 
                                        options={chartOptions} 
                                    />
                                </Box>
                            </Box>
                        ) : (
                            <Box 
                                sx={{ 
                                    height: '400px', 
                                    width: '100%', 
                                    backgroundColor: '#007474', 
                                    borderRadius: '15px', 
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#fff'
                                }}
                            >
                                <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem' }}>
                                    Witaj w AI Doctor
                                </Typography>
                                <Typography variant="body1" align="center" sx={{ color: '#ffffff', fontSize: '1rem' }}>
                                    Wybierz badania, które chcesz przeanalizować, a następnie wprowadź ich wartości, aby uzyskać porównanie do zakresów referencyjnych. AI Doctor pomoże Ci zinterpretować wyniki badań i zrozumieć ich znaczenie.
                                </Typography>
                            </Box>
                        )}
                        {analysis && (
                            <Box 
                                mt={4} 
                                p={3} 
                                sx={{ 
                                    backgroundColor: '#007474',
                                    borderRadius: '15px', 
                                    textAlign: 'center', 
                                    color: '#ffffff', 
                                    marginTop: '20px'
                                }}
                            >
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff', fontSize: '1.2rem' }}>
                                    Analiza wyników:
                                </Typography>
                                <Typography variant="body1" component="pre" sx={{ color: '#f0f0f0', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                                    {analysis}
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>
            <Footer/>
        </Box>
    );
};

export default HomePage;
