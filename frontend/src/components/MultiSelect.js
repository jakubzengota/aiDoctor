import React, { useEffect, useState } from 'react';
import { Checkbox, TextField, Autocomplete } from '@mui/material';
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

    return (
        <Autocomplete
            multiple
            options={availableTests}
            value={selectedTests}
            onChange={(event, newValue) => {
                setSelectedTests(newValue);
            }}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => {
                // Dodanie klucza `key` bezpośrednio do elementu <li>, zamiast użycia go w `...props`
                const { key, ...otherProps } = props;
                return (
                    <li {...otherProps} key={key}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option}
                    </li>
                );
            }}
            style={{ marginTop: '20px' }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    label="Wybierz badania"
                    placeholder="Wybierz badania"
                />
            )}
        />
    );
};

export default MultiSelect;
