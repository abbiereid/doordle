function cosineSimilarity(vecA, vecB) {
    return dotProduct(vecA, vecB) / (length(vecA) * length(vecB));
}

function dotProduct(vecA, vecB) {
    let product = 0;
    for(let i = 0; i < vecA.length; i++) {
        product = product + (vecA[i] * vecB[i]);
    }
    return product;
}

function length(vec) {
    let total = 0;
    for(let i = 0; i < vec.length; i++) {
        total = total + (vec[i] * vec[i]);
    }
    return Math.sqrt(total);
}