import React from 'react';
import Select from 'react-select';

const MultiSelect = ({ options, selectedTests, setSelectedTests }) => {
    // Przekształcenie danych do formatu odpowiedniego dla react-select
    const transformedOptions = options.map((test) => ({
        value: test,
        label: test,
    }));

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#007474',
            borderColor: state.isFocused ? '#ffffff' : '#ffffff', // Biała obwódka by default i kiedy jest aktywna
            color: '#ffffff',
            fontSize: '0.85rem',
            boxShadow: state.isFocused ? '0 0 0 1px #ffffff' : 'none', // Usunięcie niebieskiego cienia w stanie aktywnym
            '&:hover': {
                borderColor: '#ffffff',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#b0d7d7',
            fontSize: '0.75rem', // Zmniejszona czcionka dla placeholdera
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#007474', // Kolor tła listy opcji
            borderRadius: '8px',
            zIndex: 999, // Zapewnienie, że menu jest nad wszystkimi innymi elementami
            opacity: 1, // Ustawienie pełnej nieprzezroczystości
        }),
        menuList: (provided) => ({
            ...provided,
            padding: 0, // Dopasowanie paddingu, aby nie było zbędnych marginesów
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? '#009282' : '#007474', // Kolor tła opcji podczas hovera i default
            color: '#ffffff',
            fontSize: '0.75rem', // Zmniejszona czcionka opcji na liście
            '&:active': {
                backgroundColor: '#005f5f', // Kolor tła opcji po kliknięciu
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#004c4c',
            color: '#ffffff',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#ffffff',
            fontSize: '0.75rem', // Zmniejszona czcionka dla wybranych opcji
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#ffffff',
            ':hover': {
                backgroundColor: '#003d3d',
                color: 'white',
            },
        }),
    };

    return (
        <Select
            isMulti
            options={transformedOptions}
            value={transformedOptions.filter((option) => selectedTests.includes(option.value))}
            onChange={(selectedOptions) => {
                setSelectedTests(selectedOptions ? selectedOptions.map((option) => option.value) : []);
            }}
            styles={customStyles}
            placeholder="Wyszukaj badanie..."
        />
    );
};

export default MultiSelect;
