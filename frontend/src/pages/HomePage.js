import React, { useState, useEffect } from 'react';
import MultiSelect from '../components/MultiSelect';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
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
    const [referenceData, setReferenceData] = useState({}); // Nowy stan dla danych referencyjnych

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

    const validateInput = (test, value) => {
        if (!value || isNaN(value)) {
            setErrors(prev => ({ ...prev, [test]: 'Wartość musi być liczbą' }));
        } else {
            setErrors(prev => {
                const { [test]: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleAnalyze = async () => {
        try {
            let textToAnalyze = '';
            selectedTests.forEach(test => {
                const value = testValues[test];
                if (!value || isNaN(value)) {
                    return; // Skip if invalid value
                }
                textToAnalyze += `${test}: ${value}\n`;
            });

            const gptResponse = await analyzeText(textToAnalyze);
            setAnalysis(gptResponse.analysis);
        } catch (error) {
            console.error('Error during analysis:', error);
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

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    AI Doctor
                </Typography>
                <MultiSelect options={availableTests} selectedTests={selectedTests} setSelectedTests={setSelectedTests} />
                <Box sx={{ mt: 3 }}>
                    {selectedTests.map(test => (
                        <TextField
                            key={test}
                            label={`Wartość dla: ${test}`}
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(e) => {
                                const value = e.target.value;
                                setTestValues(prev => ({ ...prev, [test]: value }));
                                validateInput(test, value);
                            }}
                            error={!!errors[test]}
                            helperText={errors[test]}
                        />
                    ))}
                </Box>
                <Box textAlign="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAnalyze}
                        sx={{
                            mt: 3,
                            transition: 'background-color 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                            }
                        }}
                        disabled={Object.keys(errors).length > 0}
                    >
                        Przeanalizuj wyniki
                    </Button>
                </Box>
                {selectedTests.length > 0 && (
                    <Box mt={5}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Wykres wyników w odniesieniu do zakresów referencyjnych
                        </Typography>
                        <Bar data={getChartData()} options={{ responsive: true }} />
                    </Box>
                )}
                {analysis && (
                    <Box mt={4} p={2} sx={{ backgroundColor: '#222', borderRadius: '10px', textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            Analiza wyników:
                        </Typography>
                        <Typography variant="body1" component="pre" sx={{ color: '#fff', whiteSpace: 'pre-wrap' }}>
                            {analysis}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default HomePage;
