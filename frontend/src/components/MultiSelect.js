import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { getAvailableTests } from '../services/api'; // Importuj funkcję, która pobiera testy z backendu

const MultiSelect = ({ selectedTests, setSelectedTests }) => {
    const [availableTests, setAvailableTests] = useState([]); // Stan do przechowywania dostępnych testów

    // Pobranie dostępnych badań przy załadowaniu komponentu
    useEffect(() => {
        const fetchAvailableTests = async () => {
            try {
                const response = await getAvailableTests();
                setAvailableTests(response.tests); // Zakładając, że `response.tests` zawiera tablicę dostępnych testów
            } catch (error) {
                console.error('Error fetching available tests:', error);
            }
        };

        fetchAvailableTests();
    }, []);

    const handleChange = (event) => {
        const { target: { value } } = event;
        setSelectedTests(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <FormControl fullWidth variant="outlined" sx={{ marginTop: '20px' }}>
            <InputLabel id="lab-tests-label">Wybierz badania</InputLabel>
            <Select
                labelId="lab-tests-label"
                multiple
                value={selectedTests}
                onChange={handleChange}
                input={<OutlinedInput label="Wybierz badania" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 224,
                            width: 250,
                        },
                    },
                }}
            >
                {availableTests.map((test, index) => (
                    <MenuItem key={index} value={test}>
                        <Checkbox checked={selectedTests.indexOf(test) > -1} />
                        <ListItemText primary={test} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default MultiSelect;
