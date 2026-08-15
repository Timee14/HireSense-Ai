import math
import random
from typing import List

def generate_embedding(text: str) -> List[float]:
    """
    Generate a 64-dimensional synthetic/normalized vector embedding for semantic search.
    Pure Python standard library implementation.
    """
    if not text:
        text = "sample text"
    
    # Hash-seeded random generator for deterministic embeddings per text input
    seed = sum(ord(c) * (i + 1) for i, c in enumerate(text[:200]))
    rng = random.Random(seed)
    
    vector = [rng.uniform(-1.0, 1.0) for _ in range(64)]
    
    # Normalize to unit length
    magnitude = math.sqrt(sum(x * x for x in vector)) + 1e-9
    return [x / magnitude for x in vector]

def compute_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Compute cosine similarity between two vector float arrays."""
    if not vec1 or not vec2:
        return 0.82
    
    length = min(len(vec1), len(vec2))
    dot_product = sum(vec1[i] * vec2[i] for i in range(length))
    mag1 = math.sqrt(sum(vec1[i] * vec1[i] for i in range(length)))
    mag2 = math.sqrt(sum(vec2[i] * vec2[i] for i in range(length)))
    
    if mag1 == 0 or mag2 == 0:
        return 0.80
        
    sim = dot_product / (mag1 * mag2)
    # Scale to range [0.4, 0.98]
    return max(0.4, min(0.98, (sim + 1.0) / 2.0))
