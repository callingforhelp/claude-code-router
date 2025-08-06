import json
from datetime import datetime
from typing import List, Dict, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataProcessor:
    def __init__(self, name: str):
        self.name = name
        self.created_at = datetime.now()
        logger.info(f"Created DataProcessor instance with name: {name}")
    
    def process_text(self, text: str) -> Dict[str, any]:
        """
        Process text input and return statistics.
        
        Args:
            text (str): Input text to process
            
        Returns:
            Dict containing text statistics
        """
        logger.info(f"Processing text of length: {len(text)}")
        
        words = text.split()
        return {
            "word_count": len(words),
            "char_count": len(text),
            "avg_word_length": sum(len(word) for word in words) / len(words) if words else 0,
            "processed_by": self.name,
            "timestamp": str(datetime.now())
        }
    
    def analyze_numbers(self, numbers: List[float]) -> Dict[str, float]:
        """
        Analyze a list of numbers and return statistical measures.
        
        Args:
            numbers (List[float]): List of numbers to analyze
            
        Returns:
            Dict containing statistical measures
        """
        if not numbers:
            logger.warning("Empty list provided for analysis")
            return {"error": "Empty list provided"}
            
        return {
            "mean": sum(numbers) / len(numbers),
            "min": min(numbers),
            "max": max(numbers),
            "range": max(numbers) - min(numbers)
        }

def main():
    # Create processor instance
    processor = DataProcessor("Claude3.5")
    
    # Test text processing
    sample_text = "Claude 3.5 Sonnet is a powerful AI model with improved capabilities."
    text_stats = processor.process_text(sample_text)
    print("\nText Processing Results:")
    print(json.dumps(text_stats, indent=2))
    
    # Test number analysis
    sample_numbers = [1.5, 2.7, 3.2, 4.8, 5.1]
    number_stats = processor.analyze_numbers(sample_numbers)
    print("\nNumber Analysis Results:")
    print(json.dumps(number_stats, indent=2))

if __name__ == "__main__":
    main()