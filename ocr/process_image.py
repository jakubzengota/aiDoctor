from PIL import Image, ImageEnhance
import pytesseract
import pandas as pd

# Funkcja do wstępnego przetwarzania obrazu
def preprocess_image(image_path):
    """
    Poprawia jakość obrazu przed wysłaniem do OCR:
    - Konwersja do odcieni szarości.
    - Zwiększenie kontrastu.
    """
    image = Image.open(image_path).convert('L')  # Konwersja do odcieni szarości
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(2)  # Zwiększenie kontrastu
    return image

# Funkcja do analizy tekstu z obrazu
def parse_ocr_text(text):
    """
    Rozdziela tekst odczytany przez OCR na klucz-wartość (nazwy parametrów i ich wartości).
    """
    lines = text.split('\n')  # Rozdzielanie na linie
    parsed_data = []
    for line in lines:
        parts = line.split()  # Rozdzielanie po spacji
        if len(parts) == 2:  # Oczekujemy dwóch elementów w linii (parametr i wartość)
            parsed_data.append(parts)

    # Konwersja danych na DataFrame dla lepszej organizacji
    df = pd.DataFrame(parsed_data, columns=['Parametr', 'Wartość'])
    return df

# Funkcja główna do przetwarzania obrazu za pomocą OCR
def process_image(image_path):
    """
    Przetwarza obraz:
    1. Wstępnie poprawia obraz (preprocessing).
    2. Analizuje tekst za pomocą OCR.
    3. Rozdziela tekst na klucz-wartość.
    """
    # Wstępne przetwarzanie obrazu
    image = preprocess_image(image_path)

    # Ustawienia Tesseract OCR
    custom_config = r'--psm 6'  # Tryb analizy tabel/kolumn

    # Wyodrębnienie tekstu z obrazu
    raw_text = pytesseract.image_to_string(image, config=custom_config)

    # Przetwarzanie tekstu na strukturę tabelaryczną
    df = parse_ocr_text(raw_text)
    return df

# Testowanie lokalne
if __name__ == "__main__":
    # Ścieżka do przykładowego obrazu
    image_path = "example_image.jpg"

    # Przetwarzanie obrazu i wyświetlenie wyników
    try:
        result = process_image(image_path)
        print(result)
    except Exception as e:
        print(f"Error processing image: {e}")