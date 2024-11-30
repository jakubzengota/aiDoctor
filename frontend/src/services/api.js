import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

// Funkcja do analizowania tekstu z użyciem GPT
export const analyzeText = async (text) => {
    const response = await axios.post(`${API_URL}/analyze-with-gpt`, { text });
    return response.data;
};

// Funkcja do pobierania danych referencyjnych dla konkretnego badania
export const getReferenceData = async (test_name) => {
    const response = await axios.get(`${API_URL}/reference-data?test_name=${test_name}`);
    return response.data;
};

// Funkcja do pobierania wszystkich dostępnych badań z backendu
export const getAvailableTests = async () => {
    const response = await axios.get(`${API_URL}/available-tests`);
    return response.data;
};