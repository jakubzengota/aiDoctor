import pandas as pd

def parse_ocr_text(text):
    lines = text.split('\n')
    parsed_data = []
    for line in lines:
        parts = line.split()
        if len(parts) == 2:
            parsed_data.append(parts)
    df = pd.DataFrame(parsed_data, columns=['Parametr', 'Wartość'])
    return df